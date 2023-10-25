import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
  params: {
    inviteCode: string;
  };
}

export default async ({ params }: Props) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();
  if (!params.inviteCode) return redirect("/");

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (existingServer) return redirect(`/servers/${existingServer.id}`);

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [{ profileId: profile.id, role: MemberRole.GUEST }],
      },
    },
  });

  if (server) return redirect(`/servers/${server.id}`);

  return <div></div>;
};
