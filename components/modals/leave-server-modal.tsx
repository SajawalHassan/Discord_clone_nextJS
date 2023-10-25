"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const LeaveServer = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isOpen, type, onClose, data } = useModal();
  const { server } = data;

  const modalIsOpen = isOpen && type == "leaveServer";

  const handleOnClick = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/servers/${server?.id}/leave`);

      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={modalIsOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave '{server?.name}'? You won't be able
            to join again unless you have an invite link.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full ">
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleOnClick}
              disabled={isLoading}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
