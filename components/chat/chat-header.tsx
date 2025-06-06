import { Hash } from "lucide-react";
import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { RealTimeIndicator } from "@/components/real-time-indicator";
import { ChatVideoButton } from "./chat-video-button";

interface Props {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

export const ChatHeader = ({ name, serverId, type, imageUrl }: Props) => {
  return (
    <div className="font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {type === "channel" && <Hash className="w-5 h-5 to-zinc-500 dark:text-zinc-400 mr-1" />}
      {type == "conversation" && <UserAvatar src={imageUrl} className="mr-2 h-8 w-8 md:h-8 md:w-8" />}
      <p className="font-semibold text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        {type === "conversation" && <ChatVideoButton />}
        <RealTimeIndicator />
      </div>
    </div>
  );
};
