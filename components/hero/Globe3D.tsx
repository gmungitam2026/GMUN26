"use client";

import { useMemo, useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function useReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
}

/**
 * A stylized (not geographically accurate) equirectangular landmass texture,
 * drawn once on a canvas — gives the sphere an actual "globe" read instead
 * of a bare wireframe. Client-only (this whole module is dynamic-imported
 * with ssr:false), so `document` is always available here.
 */
function useEarthTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const rawCtx = canvas.getContext("2d");
    if (!rawCtx) return null;
    const ctx = rawCtx;

    const ocean = ctx.createLinearGradient(0, 0, 0, canvas.height);
    ocean.addColorStop(0, "#0f1c17");
    ocean.addColorStop(0.5, "#141f18");
    ocean.addColorStop(1, "#0f1c17");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#c9a45c";

    function landmass(points: [number, number][]) {
      ctx.beginPath();
      points.forEach(([x, y], i) => {
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
    }

    // Loose, decorative continent-like silhouettes — not a real map.
    landmass([[130,120],[210,90],[260,140],[240,210],[190,260],[140,240],[100,190]]);
    landmass([[210,270],[260,300],[250,380],[210,430],[175,400],[180,320]]);
    landmass([[470,110],[560,90],[600,150],[560,190],[520,180],[480,150]]);
    landmass([[500,210],[570,220],[590,300],[540,380],[490,340],[480,260]]);
    landmass([[640,110],[760,80],[860,120],[840,200],[760,230],[680,200]]);
    landmass([[700,260],[790,250],[820,300],[780,340],[720,320]]);
    landmass([[860,340],[930,330],[950,380],[900,410],[850,390]]);

    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = "#efe9dc";
    ctx.lineWidth = 1;
    for (let y = 64; y < canvas.height; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    for (let x = 64; x < canvas.width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

function GoldPoints() {
  // A handful of fixed "hotspot" markers scattered over the sphere — purely
  // decorative (not a claim about real delegate origins/geography).
  const positions = useMemo(() => {
    const seeds: [number, number][] = [
      [18, 83], [42, -40], [-8, 12], [55, 160], [-30, -110],
      [10, -170], [-55, 60], [70, 10], [-15, 140], [30, -70],
    ];
    return seeds.map(([latDeg, lonDeg]) => {
      const lat = (latDeg * Math.PI) / 180;
      const lon = (lonDeg * Math.PI) / 180;
      const r = 1.53;
      return new THREE.Vector3(
        r * Math.cos(lat) * Math.cos(lon),
        r * Math.sin(lat),
        r * Math.cos(lat) * Math.sin(lon)
      );
    });
  }, []);

  return (
    <>
      {positions.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshBasicMaterial color="#f2d9a0" />
        </mesh>
      ))}
    </>
  );
}

function Scene({ autoRotate }: { autoRotate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const earthTexture = useEarthTexture();

  useFrame((_, delta) => {
    if (autoRotate && group.current) {
      group.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={group}>
      {/* Solid textured globe */}
      <mesh>
        <sphereGeometry args={[1.5, 64, 48]} />
        <meshStandardMaterial
          map={earthTexture}
          color={earthTexture ? "#ffffff" : "#141210"}
          emissive="#1a140a"
          emissiveIntensity={0.25}
          roughness={0.75}
          metalness={0.05}
        />
      </mesh>
      <GoldPoints />
      {/* Thin atmospheric rim glow */}
      <mesh scale={1.04}>
        <sphereGeometry args={[1.5, 48, 32]} />
        <meshBasicMaterial color="#d4af6a" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

export default function Globe3D() {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 3, 5]} intensity={70} color="#f2d9a0" />
      <pointLight position={[-4, -2, -3]} intensity={20} color="#7d5f28" />
      <Scene autoRotate={!reducedMotion} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 2 - 0.6}
        maxPolarAngle={Math.PI / 2 + 0.6}
      />
    </Canvas>
  );
}
