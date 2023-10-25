"use client";

import { useEffect, useState } from "react";
import { CreateServer } from "@/components/modals/create-server-modal";
import { Invite } from "@/components/modals/invite-modal";
import { ServerSettings } from "@/components/modals/server-settings-modal";
import { ManageMembers } from "@/components/modals/manage-members-modal";
import { CreateChannel } from "@/components/modals/create-channel-modal";
import { LeaveServer } from "../modals/leave-server-modal";

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
    </>
  );
};
