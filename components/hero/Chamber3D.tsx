"use client";

import { Suspense, useEffect, type RefObject, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import * as THREE from "three";

/**
 * A lit committee room: two tiers of delegate desks in a horseshoe facing
 * the chair's dais, wood-panelled walls, and the floor passing from one
 * delegate to the next — the speaker rises, their microphone lights up and
 * a spotlight finds them. The camera drifts slowly and leans toward the
 * pointer. Loaded client-only via Chamber3DLoader.
 */

const SPEAK_SECONDS = 2.2;

// ---------------------------------------------------------------------------
// Reduced motion

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

// ---------------------------------------------------------------------------
// Layout

// Deterministic pseudo-random so the room looks the same on every load.
function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const SUITS = ["#1c2230", "#23252b", "#2e2a26", "#1b2a3a", "#3a3f47", "#402a2a", "#e8e4da"];
const SKIN = ["#8a5a3c", "#a8714d", "#6e4630", "#c08a64", "#7d5238"];
const FLAGS = ["#b33a3a", "#2f5fa8", "#2f8a4e", "#d8b13a", "#e8e4da", "#1f1f1f", "#d9682f"];

type SeatData = {
  position: [number, number, number];
  rotationY: number;
  occupied: boolean;
  suit: string;
  skin: string;
  flag: string;
  laptop: boolean;
};

function buildSeats(): SeatData[] {
  const tiers = [
    { radius: 3.3, count: 11, y: 0, arc: 118 },
    { radius: 4.6, count: 15, y: 0.28, arc: 122 },
  ];
  const seats: SeatData[] = [];
  let n = 0;
  for (const tier of tiers) {
    for (let i = 0; i < tier.count; i++) {
      const deg = -tier.arc + (i / (tier.count - 1)) * tier.arc * 2;
      const theta = (deg * Math.PI) / 180;
      n++;
      seats.push({
        // Horseshoe opens toward the camera (+z); the dais sits at -z.
        position: [tier.radius * Math.sin(theta), tier.y, -tier.radius * Math.cos(theta) + 0.6],
        // Local +z (the chair side) points away from the centre of the floor.
        rotationY: Math.PI - theta,
        occupied: seeded(n * 1.7) > 0.18,
        suit: SUITS[Math.floor(seeded(n * 2.3) * SUITS.length)],
        skin: SKIN[Math.floor(seeded(n * 3.1) * SKIN.length)],
        flag: FLAGS[Math.floor(seeded(n * 4.9) * FLAGS.length)],
        laptop: seeded(n * 5.7) > 0.55,
      });
    }
  }
  return seats;
}

// ---------------------------------------------------------------------------
// Shared geometry / materials (created once, reused by every seat)

const geo = {
  deskTop: new THREE.BoxGeometry(0.95, 0.06, 0.5),
  deskFront: new THREE.BoxGeometry(0.95, 0.72, 0.04),
  trim: new THREE.BoxGeometry(0.95, 0.018, 0.02),
  seat: new THREE.BoxGeometry(0.46, 0.08, 0.44),
  back: new THREE.BoxGeometry(0.46, 0.55, 0.07),
  stem: new THREE.CylinderGeometry(0.03, 0.05, 0.42, 10),
  torso: new THREE.CapsuleGeometry(0.19, 0.34, 6, 12),
  head: new THREE.SphereGeometry(0.12, 20, 16),
  hair: new THREE.SphereGeometry(0.127, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.55),
  neck: new THREE.CylinderGeometry(0.05, 0.06, 0.1, 10),
  arm: new THREE.CapsuleGeometry(0.055, 0.3, 4, 8),
  placard: new THREE.BoxGeometry(0.3, 0.1, 0.012),
  flag: new THREE.BoxGeometry(0.07, 0.05, 0.014),
  micBase: new THREE.CylinderGeometry(0.035, 0.04, 0.02, 12),
  micStem: new THREE.CylinderGeometry(0.006, 0.006, 0.32, 6),
  micHead: new THREE.SphereGeometry(0.02, 10, 8),
  paper: new THREE.BoxGeometry(0.2, 0.004, 0.28),
  laptopBase: new THREE.BoxGeometry(0.32, 0.015, 0.22),
  laptopScreen: new THREE.BoxGeometry(0.32, 0.21, 0.01),
};

const mat = {
  wood: new THREE.MeshStandardMaterial({ color: "#6b4428", roughness: 0.55, metalness: 0.05 }),
  woodDark: new THREE.MeshStandardMaterial({ color: "#3d2616", roughness: 0.6 }),
  gold: new THREE.MeshStandardMaterial({ color: "#c9a45c", roughness: 0.3, metalness: 0.9 }),
  leather: new THREE.MeshStandardMaterial({ color: "#141312", roughness: 0.45 }),
  chrome: new THREE.MeshStandardMaterial({ color: "#9a9a9a", roughness: 0.25, metalness: 1 }),
  placard: new THREE.MeshStandardMaterial({ color: "#efe9dc", roughness: 0.7 }),
  paper: new THREE.MeshStandardMaterial({ color: "#f4f1ea", roughness: 0.9 }),
  laptop: new THREE.MeshStandardMaterial({ color: "#b8b8bc", roughness: 0.35, metalness: 0.7 }),
  screen: new THREE.MeshStandardMaterial({ color: "#0d1624", emissive: "#3a5f8f", emissiveIntensity: 0.35 }),
  micIdle: new THREE.MeshStandardMaterial({ color: "#2a2a2a", roughness: 0.4 }),
  hair: new THREE.MeshStandardMaterial({ color: "#141010", roughness: 0.85 }),
};

// ---------------------------------------------------------------------------
// People

/** A seated figure facing local -z: broad torso, neck, head with hair, forearms on the desk. */
function Figure({ suit, skin }: { suit: THREE.Material; skin: THREE.Material }) {
  return (
    <>
      <mesh geometry={geo.torso} material={suit} position={[0, 0.93, 0]} scale={[1.25, 1, 0.78]} castShadow />
      <mesh geometry={geo.head} material={skin} position={[0, 1.4, -0.03]} castShadow>
        <mesh geometry={geo.hair} material={mat.hair} rotation-x={-0.35} />
      </mesh>
      <mesh geometry={geo.neck} material={skin} position={[0, 1.24, -0.01]} />
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          geometry={geo.arm}
          material={suit}
          position={[side * 0.24, 0.93, -0.2]}
          rotation={[-1.15, 0, side * 0.18]}
          castShadow
        />
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Seats

function Seat({
  data,
  index,
  activeRef,
}: {
  data: SeatData;
  index: number;
  activeRef: RefObject<number>;
}) {
  const delegate = useRef<THREE.Group>(null);
  const placard = useRef<THREE.Group>(null);
  const led = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>>(null);
  const suitMat = useMemo(() => new THREE.MeshStandardMaterial({ color: data.suit, roughness: 0.8 }), [data.suit]);
  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: data.skin, roughness: 0.6 }), [data.skin]);
  const flagMat = useMemo(() => new THREE.MeshStandardMaterial({ color: data.flag, roughness: 0.6 }), [data.flag]);
  const ledMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#3a0d0d", emissive: "#ff3b2f", emissiveIntensity: 0 }),
    []
  );

  useFrame((state, delta) => {
    const speaking = activeRef.current === index;
    const k = 1 - Math.exp(-delta * 4);
    if (delegate.current) {
      // The speaker half-rises from their chair and leans toward the mic.
      const targetY = speaking ? 0.22 : 0;
      const targetZ = speaking ? -0.14 : 0;
      delegate.current.position.y += (targetY - delegate.current.position.y) * k;
      delegate.current.position.z += (targetZ - delegate.current.position.z) * k;
      const head = delegate.current.children[0]?.children[1];
      if (head) head.rotation.x = speaking ? Math.sin(state.clock.elapsedTime * 3.2) * 0.06 : 0;
    }
    if (placard.current) {
      // Placard tilts up, the way delegates raise it to be recognised.
      const target = speaking ? -0.9 : -0.25;
      placard.current.rotation.x += (target - placard.current.rotation.x) * k;
    }
    if (led.current) {
      const m = led.current.material;
      m.emissiveIntensity += ((speaking ? 4 : 0) - m.emissiveIntensity) * k;
    }
  });

  return (
    <group position={data.position} rotation-y={data.rotationY}>
      {/* Desk */}
      <mesh geometry={geo.deskTop} material={mat.wood} position={[0, 0.75, 0]} castShadow receiveShadow />
      <mesh geometry={geo.deskFront} material={mat.woodDark} position={[0, 0.38, -0.23]} castShadow receiveShadow />
      <mesh geometry={geo.trim} material={mat.gold} position={[0, 0.735, -0.255]} />

      {/* Papers / laptop */}
      <mesh
        geometry={geo.paper}
        material={mat.paper}
        position={[-0.22, 0.782, 0.05]}
        rotation-y={(seeded(index + 11) - 0.5) * 0.5}
        receiveShadow
      />
      {data.laptop && (
        <group position={[0.12, 0.787, 0.02]} rotation-y={Math.PI}>
          <mesh geometry={geo.laptopBase} material={mat.laptop} castShadow />
          <mesh geometry={geo.laptopScreen} material={mat.laptop} position={[0, 0.1, 0.11]} rotation-x={0.3} castShadow />
          <mesh
            geometry={geo.laptopScreen}
            material={mat.screen}
            position={[0, 0.1, 0.103]}
            rotation-x={0.3}
            scale={[0.92, 0.88, 0.5]}
          />
        </group>
      )}

      {/* Country placard with a flag chip */}
      <group ref={placard} position={[0, 0.8, -0.17]} rotation-x={-0.25}>
        <mesh geometry={geo.placard} material={mat.placard} position={[0, 0.05, 0]} castShadow />
        <mesh geometry={geo.flag} material={flagMat} position={[-0.09, 0.05, -0.004]} />
      </group>

      {/* Microphone */}
      <group position={[0.34, 0.785, -0.12]}>
        <mesh geometry={geo.micBase} material={mat.micIdle} />
        <mesh geometry={geo.micStem} material={mat.chrome} position={[0, 0.15, 0.05]} rotation-x={0.35} />
        <mesh ref={led} geometry={geo.micHead} material={ledMat} position={[0, 0.3, 0.105]} />
      </group>

      {/* Chair */}
      <group position={[0, 0, 0.55]}>
        <mesh geometry={geo.stem} material={mat.chrome} position={[0, 0.22, 0]} />
        <mesh geometry={geo.seat} material={mat.leather} position={[0, 0.47, 0]} castShadow receiveShadow />
        <mesh geometry={geo.back} material={mat.leather} position={[0, 0.8, 0.22]} rotation-x={0.12} castShadow />
      </group>

      {/* Delegate */}
      {data.occupied && (
        <group ref={delegate}>
          <group position={[0, 0, 0.5]}>
            <Figure suit={suitMat} skin={skinMat} />
          </group>
        </group>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Room

function useSlatTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const slats = 32;
    const w = canvas.width / slats;
    for (let i = 0; i < slats; i++) {
      const tone = 60 + Math.floor(seeded(i + 3) * 22);
      ctx.fillStyle = `rgb(${tone + 38}, ${tone}, ${Math.floor(tone * 0.62)})`;
      ctx.fillRect(i * w, 0, w, canvas.height);
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(i * w + w - 2, 0, 2, canvas.height);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(3, 1);
    texture.anisotropy = 8;
    return texture;
  }, []);
}

function Walls() {
  const slats = useSlatTexture();
  return (
    <mesh position={[0, 1.9, 0.6]} rotation-y={Math.PI}>
      <cylinderGeometry args={[7.4, 7.4, 3.8, 64, 1, true, -Math.PI * 0.62, Math.PI * 1.24]} />
      <meshStandardMaterial map={slats} side={THREE.BackSide} roughness={0.7} />
    </mesh>
  );
}

function LogoPlaque() {
  const logo = useTexture("/logos/gmun-club-logo.jpg", (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
  });
  return (
    <group position={[0, 2.55, -6.62]}>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[1.25, 1.45, 0.04]} />
        <meshStandardMaterial color="#c9a45c" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh>
        <planeGeometry args={[1.14, 1.34]} />
        <meshBasicMaterial map={logo} toneMapped={false} color="#cfcfcf" />
      </mesh>
    </group>
  );
}

function Dais() {
  const suitMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1a1d24", roughness: 0.8 }), []);
  const skinMats = useMemo(() => SKIN.slice(0, 3).map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 })), []);
  return (
    <group position={[0, 0, -5.4]}>
      {/* Platform */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.6, 0.4, 1.9]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.405, 0.95]}>
        <boxGeometry args={[4.6, 0.02, 0.02]} />
        <primitive object={mat.gold} attach="material" />
      </mesh>
      {/* Chair's bench */}
      <group position={[0, 0.4, 0.35]}>
        <mesh position={[0, 0.78, 0]} material={mat.wood} castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.07, 0.6]} />
        </mesh>
        <mesh position={[0, 0.4, 0.28]} material={mat.woodDark} castShadow>
          <boxGeometry args={[3.4, 0.78, 0.05]} />
        </mesh>
        <mesh position={[0, 0.45, 0.31]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 40]} />
          <primitive object={mat.gold} attach="material" />
        </mesh>
        {[-1, 0, 1].map((x, i) => (
          <group key={x} position={[x * 1.05, 0, -0.55]}>
            <mesh geometry={geo.stem} material={mat.chrome} position={[0, 0.22, 0]} />
            <mesh geometry={geo.seat} material={mat.leather} position={[0, 0.47, 0]} castShadow />
            <mesh geometry={geo.back} material={mat.leather} position={[0, 0.85, -0.22]} rotation-x={-0.1} scale={[1, 1.25, 1]} castShadow />
            <group position={[0, 0, -0.05]} rotation-y={Math.PI}>
              <Figure suit={suitMat} skin={skinMats[i]} />
            </group>
          </group>
        ))}
        {/* Gavel block */}
        <mesh position={[0.55, 0.83, 0.1]} material={mat.woodDark}>
          <cylinderGeometry args={[0.07, 0.07, 0.03, 20]} />
        </mesh>
      </group>
    </group>
  );
}

// Horseshoe-shaped step under the outer tier. Shape space maps to the floor
// via rotation-x(-90°), so a seat at angle θ sits at shape angle 90° − θ.
function buildRiser() {
  const from = ((90 - 128) * Math.PI) / 180;
  const to = ((90 + 128) * Math.PI) / 180;
  const shape = new THREE.Shape();
  shape.absarc(0, 0, 5.3, from, to, false);
  shape.absarc(0, 0, 4.0, to, from, true);
  return new THREE.ExtrudeGeometry(shape, { depth: 0.28, bevelEnabled: false, curveSegments: 48 });
}

function Floor() {
  const riser = useMemo(() => buildRiser(), []);
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[9, 64]} />
        <meshStandardMaterial color="#2b1714" roughness={0.95} />
      </mesh>
      {/* Raised platform for the outer tier */}
      <mesh geometry={riser} position={[0, 0, 0.6]} rotation-x={-Math.PI / 2} castShadow receiveShadow>
        <meshStandardMaterial color="#35201a" roughness={0.9} />
      </mesh>
      {/* Well of the chamber */}
      <mesh position={[0, 0.005, 0.2]} rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[2.1, 64]} />
        <meshStandardMaterial color="#4a1f1c" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.008, 0.2]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[2.05, 2.12, 96]} />
        <primitive object={mat.gold} attach="material" />
      </mesh>
      <mesh position={[0, 0.008, 0.2]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1.1, 1.13, 96]} />
        <primitive object={mat.gold} attach="material" />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Scene

function Chamber({ animate }: { animate: boolean }) {
  const seats = useMemo(() => buildSeats(), []);
  const speakers = useMemo(() => {
    // Shuffle occupied seats so the floor jumps around the room.
    const idx = seats.map((s, i) => (s.occupied ? i : -1)).filter((i) => i >= 0);
    return idx.sort((a, b) => seeded(a * 9.3) - seeded(b * 9.3));
  }, [seats]);

  const activeRef = useRef<number>(speakers[0]);
  const spot = useRef<THREE.SpotLight>(null);
  const spotTarget = useRef<THREE.Object3D>(null);
  const lookAt = useMemo(() => new THREE.Vector3(0, 0.7, -1.2), []);

  useEffect(() => {
    if (spot.current && spotTarget.current) spot.current.target = spotTarget.current;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    activeRef.current = animate ? speakers[Math.floor(t / SPEAK_SECONDS) % speakers.length] : speakers[0];

    // Spotlight glides to the current speaker.
    const s = seats[activeRef.current];
    const k = 1 - Math.exp(-delta * 2.5);
    const rot = s.rotationY;
    const tx = s.position[0] + Math.sin(rot) * 0.5;
    const tz = s.position[2] + Math.cos(rot) * 0.5;
    const target = spotTarget.current;
    if (target) {
      target.position.x += (tx - target.position.x) * k;
      target.position.y = 0.9;
      target.position.z += (tz - target.position.z) * k;
      target.updateMatrixWorld();
    }

    // Slow cinematic drift plus a gentle lean toward the pointer.
    const drift = animate ? Math.sin(t * 0.07) : 0;
    const px = animate ? state.pointer.x : 0;
    const py = animate ? state.pointer.y : 0;
    const cx = drift * 2.2 + px * 0.8;
    const cy = 5.2 + Math.sin(t * 0.05) * (animate ? 0.3 : 0) + py * 0.4;
    const cz = 9.4 - Math.abs(drift) * 0.6;
    const { camera } = state;
    camera.position.x += (cx - camera.position.x) * 0.04;
    camera.position.y += (cy - camera.position.y) * 0.04;
    camera.position.z += (cz - camera.position.z) * 0.04;
    camera.lookAt(lookAt);
  });

  return (
    <>
      <hemisphereLight args={["#ffe2b8", "#1a100a", 0.45]} />
      <directionalLight
        position={[3, 9, 5]}
        intensity={1.1}
        color="#ffe7c4"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0004}
      />
      {/* Ceiling downlights */}
      {[
        [-3.5, 6, -2],
        [3.5, 6, -2],
        [0, 6, -5.2],
      ].map((p, i) => (
        <spotLight
          key={i}
          position={p as [number, number, number]}
          angle={0.75}
          penumbra={1}
          intensity={18}
          distance={14}
          decay={1.6}
          color="#ffd6a0"
        />
      ))}
      {/* Speaker spotlight */}
      <spotLight ref={spot} position={[0, 7.5, 1.5]} angle={0.16} penumbra={0.7} intensity={70} distance={16} decay={1.4} color="#fff0d6" />
      <object3D ref={spotTarget} />

      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2} color="#ffd9a8" position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={0.6} color="#8a5a34" position={[0, 2, -8]} scale={[16, 4, 1]} />
      </Environment>

      <Floor />
      <Walls />
      <Dais />
      <Suspense fallback={null}>
        <LogoPlaque />
      </Suspense>
      {seats.map((seat, i) => (
        <Seat key={i} data={seat} index={i} activeRef={activeRef} />
      ))}
    </>
  );
}

export default function Chamber3D() {
  const reducedMotion = useReducedMotion();
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Stop rendering once the hero scrolls out of view.
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="h-full w-full">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 5.2, 9.4], fov: 42, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        style={{ background: "transparent" }}
      >
        <Chamber animate={!reducedMotion} />
      </Canvas>
    </div>
  );
}
