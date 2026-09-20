"use client";

import { Button } from "./Button";

export function PrintButton() {
  return (
    <Button type="button" variant="secondary" onClick={() => window.print()}>
      Print / Save as PDF
    </Button>
  );
}
