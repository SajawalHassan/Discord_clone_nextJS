import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "./db";

export const currentProfile = async () => {
  try {
    await db.$connect();

    const clerkUser = await currentUser();
    if (!clerkUser) return redirectToSignIn();

    const profile = await db.profile.findUnique({
      where: {
        userID: clerkUser.id,
      },
    });

    if (profile) return profile;

    const newProfile = await db.profile.create({
      data: {
        userID: clerkUser.id,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        imageUrl: clerkUser.imageUrl,
        email: clerkUser.emailAddresses[0].emailAddress,
      },
    });

    return newProfile;
  } catch (error) {
    console.log(error);
  }
};
