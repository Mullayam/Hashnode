import { Tooltip } from "@mantine/core";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { formatDate } from "~/utils/miniFunctions";

interface Props {
  data: {
    id: string;
    title: string;
    cover_image: string | null;
    slug: string;
    likesCount: number;
    commentsCount: number;
    createdAt: Date;
    updatedAt: Date;
    user: {
      name: string;
      username: string;
      image: string | null;
      id: string;
      stripeSubscriptionStatus: string | null;
    };
  };
}

const SearchArticle: FC<Props> = ({ data }) => {
  return (
    <Link href={`/u/@${data.user.username}/${data.slug}`}>
      <div className="flex items-center gap-2 border-b border-border-light bg-white p-4 last:border-none dark:border-border dark:bg-primary">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-700 dark:text-text-secondary">
              {data.user.name}
            </h3>
            {data.user.stripeSubscriptionStatus === "active" && (
              <Tooltip
                label="Hashnode Clone Pro User"
                position="bottom"
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "400",
                  letterSpacing: "0.5px",
                }}
              >
                <span className="rounded-md border border-border-light bg-light-bg px-2 py-1 text-xs font-semibold tracking-wider text-gray-700 dark:border-border dark:bg-primary-light dark:text-text-secondary">
                  PRO
                </span>
              </Tooltip>
            )}
          </div>

          <div className="mb-4 flex items-center gap-1">
            <p className="text-base font-medium text-gray-500 dark:text-text-primary">
              @{data.user.username}
            </p>

            <span className="text-base font-normal text-gray-500 dark:text-text-primary">
              ·
            </span>

            <span className="text-sm font-normal text-gray-500 dark:text-text-primary">
              {formatDate(new Date(data.createdAt))}
            </span>
          </div>

          <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-text-secondary">
            {data.title}
          </h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-primary" />
              <p className="text-base font-medium text-gray-700 dark:text-text-primary">
                {data.likesCount}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6 fill-none stroke-gray-700 dark:stroke-text-primary" />
              <p className="text-base font-medium text-gray-700 dark:text-text-primary">
                {data.commentsCount}
              </p>
            </div>
          </div>
        </div>

        {data.cover_image && (
          <div className="relative hidden sm:block">
            <Image
              src={data.cover_image}
              alt={data.title}
              width={600}
              height={600}
              className="w-52 select-none overflow-hidden rounded-xl"
              draggable={false}
            />
          </div>
        )}
      </div>
    </Link>
  );
};

export default SearchArticle;
