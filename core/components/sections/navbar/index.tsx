import Route from "../../elements/route";
import Search from "./search";
import SignIn from "./sign-in";
import User from "./user";
import { getProviders } from "next-auth/react";
import serialize from "@core/utilities/serialize";
import prisma from "@core/libraries/prisma";
import Chat from "../chat/float/navbar";
import useSession from "@core/hooks/use-session";

const Navbar = async () => {
  const session = await useSession();
  const users = await prisma.user.findMany();
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! || "!" },
    include: {
      freelancer: true,
    },
  });

  const categories = await prisma.category.findMany();
  const providers = await getProviders();

  const asClientMessages = await prisma.message.findMany({
    where: {
      userId: user?.id || "!",
    },
    include: {
      freelancer: {
        include: {
          user: true,
        },
      },
    },
  });

  const asFreelancerMessages = await prisma.message.findMany({
    where: {
      freelancerId: user?.freelancer?.id || "!",
    },
    include: {
      user: true,
    },
  });

  return (
    <nav className="contain space-y-4">
      {/* Upper Nav */}
      <div className="flex items-center gap-4">
        <strong className="text-2xl">Codery</strong>
        <Search users={users} />
        <ul className="flex gap-4">
          <Route to="Home" href="/" isBold />
        </ul>

        <Chat
          asClientMessages={asClientMessages}
          asFreelancerMessages={asFreelancerMessages}
        />

        {user ? (
          <User user={serialize(user)} />
        ) : (
          <SignIn providers={providers!} />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
