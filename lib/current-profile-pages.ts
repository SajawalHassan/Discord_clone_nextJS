import { getAuth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { NextRequest } from "next/server";

export const currentProfilePages = async (req: NextRequest) => {
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
