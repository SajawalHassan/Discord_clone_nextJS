"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";

interface Props {
  onChange: (emoji: any) => void;
}

export const EmojiPicker = ({ onChange }: Props) => {
  const { resolvedTheme } = useTheme();

  const fetchEmojiData = async () => {
    const response = await fetch("https://cdn.jsdelivr.net/npm/@emoji-mart/data");

    return response.json();
  };
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent side="right" sideOffset={40} className="bg-transparent border-none shadow-none drop-shadow-none mb-16">
          <Picker data={fetchEmojiData} onEmojiSelect={(emoji: any) => onChange(emoji.native)} theme={resolvedTheme} />
        </PopoverContent>
      </Popover>
    </div>
  );
};
