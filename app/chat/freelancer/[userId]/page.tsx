import useUser from "@core/hooks/use-user";
import prisma from "@core/libraries/prisma";
import Form from "./form";

type Props = {
  params: {
    userId: string;
  };
};

const Page = async ({ params }: Props) => {
  const { userId } = params;

  const user = await useUser();
  const sender = await prisma.user.findUnique({
    where: { id: userId },
  });

  return (
    <Form sender={sender} user={user} userId={userId} freelancerId={user!.freelancer!.id} />
  );
};

export default Page;
