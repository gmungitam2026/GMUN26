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
      const r = 1.52;
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
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#d4af6a" />
        </mesh>
      ))}
    </>
  );
}

function Scene({ autoRotate }: { autoRotate: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && group.current) {
      group.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={group}>
      {/* Solid inner orb */}
      <mesh>
        <sphereGeometry args={[1.48, 48, 32]} />
        <meshStandardMaterial color="#141210" emissive="#1a140a" emissiveIntensity={0.4} roughness={0.85} />
      </mesh>
      {/* Wireframe grid */}
      <mesh>
        <sphereGeometry args={[1.5, 24, 16]} />
        <meshBasicMaterial color="#b7924e" wireframe transparent opacity={0.35} />
      </mesh>
      <GoldPoints />
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
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 3, 5]} intensity={60} color="#d4af6a" />
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
