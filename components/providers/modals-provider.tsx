"use client";

import { useEffect, useState } from "react";
import { CreateServer } from "../modals/create-server-modal";

export const ModalsProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServer />
    </>
  );
};
