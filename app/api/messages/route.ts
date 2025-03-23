import { currentProfile } from "@/lib/current-profile";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("ChannelId missing", { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    // If we haven't reached the end of the total messages
    if (messages.length === MESSAGES_BATCH)
      nextCursor = messages[MESSAGES_BATCH - 1].id;

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("MESSAGES_GET", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfilePages(req);
    const body = await req.json(); // Use req.json() to parse JSON in the new API
    const { content } = body;
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");
    const channelId = searchParams.get("channelId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!content) return new NextResponse("Missing content", { status: 400 });

    if (!serverId)
      return new NextResponse("Missing server id", { status: 400 });

    if (!channelId)
      return new NextResponse("Missing channel id", { status: 400 });

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
        channels: true,
      },
    });

    if (!server) return new NextResponse("Server not found", { status: 404 });

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) return new NextResponse("Channel not found", { status: 404 });

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) return new NextResponse("Member not found", { status: 404 });

    const message = await db.message.create({
      data: {
        content,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.log("MESSAGES_POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
