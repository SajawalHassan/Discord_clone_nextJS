import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { serverId: string } }
) => {
  try {
    const profile = await currentProfile();
    const { imageUrl, name } = await req.json();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        imageUrl,
        name,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("SERVERID_PATH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
