import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

async function getMessageInfo(req: NextRequest, messageId: string) {
  try {
    const profile = await currentProfilePages(req);
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("ServerId missing", { status: 400 });
    }

    if (!channelId) {
      return new NextResponse("ChannelId missing", { status: 400 });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
        channels: {
          some: {
            serverId: serverId as string,
          },
        },
      },
      include: {
        members: true,
        channels: true,
      },
    });

    if (!server) {
      return new NextResponse("Server, members or channels missing", {
        status: 404,
      });
    }

    const currentMember = server.members.find((member) => member.profileId === profile.id);

    if (!currentMember) {
      return new NextResponse("member missing", { status: 404 });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return new NextResponse("Message not found / deleted", { status: 404 });
    }

    const isMessageOwner = message.memberId === currentMember.id;
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const canModify = isAdmin || isModerator || isMessageOwner;

    if (!canModify || !isMessageOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return [message, messageId];
  } catch (error) {
    console.log(error);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { messageId: string } }) {
  try {
    let [message, messageId]: any = await getMessageInfo(req, params.messageId);
    const { content } = await req.json();

    message = await db.message.update({
      where: {
        id: messageId as string,
      },
      data: {
        content,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    return NextResponse.json("Message edited");
  } catch (error) {
    console.log(error);
    return new NextResponse("internal server error", { status: 500, statusText: JSON.stringify(error) });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { messageId: string } }) {
  try {
    let [message, messageId]: any = await getMessageInfo(req, params.messageId);

    message = await db.message.update({
      where: {
        id: messageId as string,
      },
      data: {
        deleted: true,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    return NextResponse.json("Message deleted");
  } catch (error) {
    console.log(error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
