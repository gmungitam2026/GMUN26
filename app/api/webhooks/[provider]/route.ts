import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Payment gateway webhooks are disabled for manual QR payments." },
    { status: 410 }
  );
}
