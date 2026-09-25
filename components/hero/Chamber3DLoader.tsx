"use client";

import dynamic from "next/dynamic";
import { CouncilChamber } from "@/components/hero/CouncilChamber";

// The SVG chamber stands in while three.js loads.
const Chamber3D = dynamic(() => import("./Chamber3D"), {
  ssr: false,
  loading: () => <CouncilChamber />,
});

export function Chamber3DLoader() {
  return <Chamber3D />;
}
