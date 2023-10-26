"use client";

import { ServerWithMembersAndProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface Props {
  label: string;
  role?: MemberRole;
  sectionType?: "channel" | "member";
  channelType?: ChannelType;
  server?: ServerWithMembersAndProfiles;
}

export const ServerSection = ({
  label,
  channelType,
  role,
  sectionType,
  server,
}: Props) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channel" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen("createChannel", { channelType })}
          >
            <Plus className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
      {role == MemberRole.ADMIN && sectionType === "member" && (
        <ActionTooltip label="Add Member" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen("manageMembers", { server })}
          >
            <Settings className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
