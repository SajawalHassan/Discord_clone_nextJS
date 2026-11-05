import { getAuth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { NextApiRequest } from "next";

export const currentProfilePages = async (req: NextRequest | NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userID: userId,
    },
  });

  return profile;
};
