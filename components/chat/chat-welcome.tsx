"use client";

import { Hash } from "lucide-react";

interface Props {
  name: string;
  type: "channel" | "conversation";
}

export const ChatWelcome = ({ type, name }: Props) => {
  return (
    <div className="px-4 mb-4 space-y-4">
      {type === "channel" && (
        <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
          <Hash className="text-white h-12 w-12" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold">
        {type === "channel" ? "Welcome to #" : "Message  "}
        {name}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        {type === "channel" ? `This is the start of the #${name} channel` : `This is the start the start of your conversation with ${name}`}
      </p>
    </div>
  );
};
