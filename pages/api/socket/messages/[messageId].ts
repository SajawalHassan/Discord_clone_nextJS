import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed!" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ message: "ServerId missing" });
    }

    if (!channelId) {
      return res.status(400).json({ message: "ChannelId missing" });
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
      return res.status(404).json({ message: "Server, members or channels missing" });
    }

    const currentMember = server.members.find((member) => member.profileId === profile.id);

    if (!currentMember) {
      return res.status(404).json({ message: "Member missing" });
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
      return res.status(404).json({ message: "Message not found" });
    }

    const isMessageOwner = message.memberId === currentMember.id;
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const canModify = isAdmin || isModerator || isMessageOwner;

    if (!canModify) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "DELETE") {
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
    }
    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ message: "Unauthorized" });
      }

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
    }

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json({ message });
  } catch (error) {
    console.log("MESSAGES_ID", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
