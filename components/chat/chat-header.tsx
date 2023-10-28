import { Hash, Menu } from "lucide-react";
import { MobileToggle } from "@/components/mobile-toggle";

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
      {type === "channel" && (
        <Hash className="w-5 h-5 to-zinc-500 dark:text-zinc-400 ml-2 mr-1" />
      )}
      <p className="font-semibold text-black dark:text-white">{name}</p>
    </div>
  );
};
