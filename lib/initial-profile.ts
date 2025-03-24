import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
// import { MemberRole } from "@prisma/client";
// const globalServerId = "49ddbf48-5824-4a46-b0d3-42272e30d40e";

export const initialProfile = async () => {
  try {
    db.$connect();

    const user = await currentUser();

    if (!user) {
      return redirectToSignIn();
    }

    const profile = await db.profile.findUnique({
      where: {
        userID: user.id,
      },
    });

    if (profile) {
      return profile;
    }

    const newProfile = await db.profile.create({
      data: {
        userID: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    // Add new user to global server
    // await db.server.update({
    //   where: {
    //     inviteCode: globalServerId,
    //   },
    //   data: {
    //     members: {
    //       create: [{ profileId: newProfile.id, role: MemberRole.GUEST }],
    //     },
    //   },
    // });

    return newProfile;
  } catch (error) {
    console.log(error);
  }
};
