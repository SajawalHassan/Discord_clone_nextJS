import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

async function getMessageInfo(req: NextRequest) {
  try {
    const profile = await currentProfilePages(req);
    const { searchParams } = new URL(req.url);

    const directMessageId = searchParams.get("messageId");
    const conversationId = searchParams.get("conversationId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!directMessageId) {
      return new NextResponse("Direct message id missing", { status: 400 });
    }

    if (!conversationId) {
      return new NextResponse("Convervation id missing", { status: 400 });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return new NextResponse("Conversation missing", { status: 404 });
    }

    const currentMember = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;

    if (!currentMember) {
      return new NextResponse("Member missing", { status: 404 });
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted) {
      return new NextResponse("directMessage not found / deleted", {
        status: 404,
      });
    }

    const isMessageOwner = directMessage.memberId === currentMember.id;
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const canModify = isAdmin || isModerator || isMessageOwner;

    if (!canModify || !isMessageOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return [directMessage, directMessageId, isMessageOwner];
  } catch (error) {
    console.log(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    let [directMessage, directMessageId, isMessageOwner]: any = await getMessageInfo(req);
    const { content } = await req.json();

    if (!isMessageOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    directMessage = await db.directMessage.update({
      where: {
        id: directMessageId as string,
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

    return NextResponse.json("Direct message edited");
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    let [directMessage, directMessageId]: any = await getMessageInfo(req);

    directMessage = await db.directMessage.update({
      where: {
        id: directMessageId as string,
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

    return NextResponse.json("Direct message edited");
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
