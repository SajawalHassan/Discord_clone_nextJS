import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!serverId) return new NextResponse("Missing ServerId", { status: 400 });
    if (!params.channelId)
      return new NextResponse("Missing ChannelId", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
        channels: {
          some: {
            id: params.channelId,
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("CHANNEL_ID_DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
