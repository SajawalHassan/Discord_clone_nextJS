"use client";

import { useEffect, useState } from "react";
import { CreateServer } from "@/components/modals/create-server-modal";
import { Invite } from "@/components/modals/invite-modal";

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
    </>
  );
};
