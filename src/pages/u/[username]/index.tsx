import { eq } from "drizzle-orm";
import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession } from "next-auth";
import LeftAside from "~/components/asides/Left";
import Header from "~/components/header/Header";
import MetaTags from "~/components/meta/MetaTags";
import UserProfile from "~/components/pages/profile";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";
import { follow, users } from "~/server/db/schema";
import { type DetailedUser, type SocialHandles } from "~/types";

const UserBlog: NextPage<{
  user: DetailedUser;
}> = ({ user }) => {
  return (
    <>
      <MetaTags
        title={`
          ${user.name} (@${user.username})`}
        description={user.tagline}
      />
      <Header />
      <main className="min-h-[100dvh] w-full bg-light-bg dark:bg-black">
        <div className="container-body mx-auto max-w-[1550px] gap-4 px-2 sm:px-4">
          <LeftAside />
          <UserProfile user={user} />
        </div>
      </main>
    </>
  );
};

export default UserBlog;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const username = context.query?.username as string | undefined;
  let user = null;

  if (username) {
    user = await db.query.users.findFirst({
      where: eq(users.username, username.slice(1, username.length)),
      with: {
        handle: {
          columns: {
            id: true,
            name: true,
            handle: true,
            about: true,
          },
        },
        ...(session?.user.id && {
          followers: {
            columns: {
              followingId: false,
              userId: false,
            },
            where: eq(follow.followingId, session?.user.id),
            with: {
              following: {
                columns: {
                  id: true,
                },
              },
            },
          },
        }),
      },
    });
  }

  if (!user) {
    return {
      notFound: true,
    };
  }

  const isFollowing = (user?.followers ?? []).length > 0;

  return {
    props: {
      user: JSON.parse(
        JSON.stringify({
          ...user,
          isFollowing,
          social: JSON.parse(JSON.stringify(user?.social)) as SocialHandles,
        }),
      ) as DetailedUser,
    },
  };
};
