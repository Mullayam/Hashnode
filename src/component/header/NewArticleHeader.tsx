import Link from "next/link";
import React, { useContext, type FC } from "react";
import { Angleleft, Cloud, LogonoText, Sun } from "~/svgs";
import LoadingSpinner from "~/svgs/LoadingSpinner";
import { C, type ContextValue } from "~/utils/context";

interface Props {
  publishing: boolean;
  savedState: boolean;
  setPublishModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewArticleHeader: FC<Props> = ({
  savedState,
  setPublishModal,
  publishing,
}) => {
  const { user, handleTheme } = useContext(C) as ContextValue;

  return (
    <header className="w-full border-b border-border-light bg-white dark:border-border dark:bg-primary">
      <div className="mx-auto flex w-full max-w-[1000px] items-center justify-between p-4">
        <div className="flex items-center justify-start gap-2">
          <Link href="/">
            <button
              aria-label="icon"
              role="button"
              className="btn-icon flex h-10 w-10"
            >
              <Angleleft className="h-4 w-4 fill-gray-700 dark:fill-text-secondary" />
            </button>
          </Link>

          <div>
            <Link
              href={`/u/@${user?.user.username as string}`}
              className="flex items-center gap-2"
            >
              <LogonoText className="h-7 fill-secondary" />
              <span className="hidden text-sm font-semibold text-gray-700 dark:text-text-secondary sm:block md:text-lg">
                {user?.user.username}&apos;s Blog
              </span>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4 border-r border-border-light px-4 dark:border-border">
            <div className="hidden items-center gap-2 sm:flex">
              {savedState ? (
                <div className="flex items-center justify-center gap-2">
                  <Cloud className="h-6 w-6" />
                  <span className="text-base text-green">Saved</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner className="h-6 w-6 fill-none stroke-gray-500" />
                  <span className="text-base text-gray-500">Saving...</span>
                </div>
              )}
            </div>

            <button onClick={handleTheme} className="btn-icon-large flex">
              <Sun className="h-6 w-6 stroke-gray-700 dark:stroke-text-secondary" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-subtle hidden text-sm text-gray-700 dark:text-white lg:flex">
              Preview
            </button>

            <button
              disabled={publishing}
              onClick={() => void setPublishModal(true)}
              className={`${publishing ? "opacity-50" : ""} btn-filled`}
            >
              {publishing ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewArticleHeader;