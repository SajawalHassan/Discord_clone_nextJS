import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // BYPASS: If Next.js is building/collecting data, exit immediately without running LiveKit code
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({ bypass: true });
  }

  const room = req.nextUrl.searchParams.get("room");
  const username = req.nextUrl.searchParams.get("username");

  if (!room || !username) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, { identity: username });
    at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

    const token = await at.toJwt();
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
