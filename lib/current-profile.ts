import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { initialProfile } from "./initial-profile";

export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userID: userId,
    },
  });

  if (userId && !profile) {
    const newProfile = await initialProfile();

    return newProfile;
  }

  return profile;
};
