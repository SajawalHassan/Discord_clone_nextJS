"use client";

import { Badge } from "@/components/ui/badge";

export const RealTimeIndicator = () => {
  return (
    <Badge variant="outline" className="bg-yellow-600 text-white border-none">
      Fallback: Polling every 1s
    </Badge>
  );
};
