"use client";

import { useEffect, useState } from "react";
import { CreateServer } from "@/components/modals/create-server-modal";
import { Invite } from "@/components/modals/invite-modal";
import { ServerSettings } from "@/components/modals/server-settings-modal";
import { ManageMembers } from "@/components/modals/manage-members-modal";
import { CreateChannel } from "@/components/modals/create-channel-modal";
import { LeaveServer } from "@/components/modals/leave-server-modal";
import { DeleteServer } from "@/components/modals/delete-server-modal";
import { DeleteChannel } from "@/components/modals/delete-channel-modal";
import { EditChannel } from "@/components/modals/edit-channel-modal";
import { DeleteMessage } from "@/components/modals/delete-message-modal";

export const ModalsProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServer />
      <Invite />
      <ServerSettings />
      <ManageMembers />
      <CreateChannel />
      <LeaveServer />
      <DeleteServer />
      <DeleteChannel />
      <EditChannel />
      <DeleteMessage />
    </>
  );
};
