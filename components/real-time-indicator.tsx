"use client";

import { Badge } from "@/components/ui/badge";

export const RealTimeIndicator = () => {
  return (
    <Badge variant="outline" className="bg-yellow-600 text-white border-none">
      Not real time: Polling every 1s
    </Badge>
  );
};
