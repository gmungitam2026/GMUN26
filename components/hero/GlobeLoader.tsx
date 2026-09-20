"use client";

import dynamic from "next/dynamic";

const Globe3D = dynamic(() => import("./Globe3D"), {
  ssr: false,
  loading: () => <GlobeFallback />,
});

function GlobeFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-[70%] w-[70%] rounded-full border border-gold/40" style={{ animation: "reveal 1.2s ease-out" }} />
    </div>
  );
}

export function GlobeLoader() {
  return (
    <div className="relative h-full w-full">
      <Globe3D />
    </div>
  );
}
