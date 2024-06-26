import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import FilterHeader from "~/components/FilterHeader";
import ManageData from "~/components/ManageData";
import MainLayout from "~/components/layouts/MainLayout";
import ArticleLoading from "~/components/loading/Article";
import useOnScreen from "~/hooks/useOnScreen";
import { type ArticleCard } from "~/types";
import { api } from "~/utils/api";
import { C, type TrendingArticleTypes } from "~/utils/context";

const Home: NextPage = () => {
  const tab = useRouter().query.tab as
    | string
    | undefined
    | TrendingArticleTypes;
  const { filter } = useContext(C)!;

  const {
    data,
    isLoading,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = api.posts.getAll.useInfiniteQuery(
    {
      type: (tab?.toString().toUpperCase() ?? "PERSONALIZED") as
        | "LATEST"
        | "PERSONALIZED"
        | "FOLLOWING",
      filter: filter.data,
    },
    {
      enabled: filter.data.shouldApply,
      retry: 0,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const bottomRef = useRef<HTMLDivElement>(null);
  const reachedBottom = useOnScreen(bottomRef);

  const [articles, setArticles] = useState<{
    data: ArticleCard[];
    isLoading: boolean;
  }>({
    data: [],
    isLoading: true,
  });

  useEffect(() => {
    if (data) {
      setArticles({
        data: data?.pages.flatMap((page) => page.posts),
        isLoading: isLoading,
      });
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (reachedBottom && hasNextPage) {
      void fetchNextPage();
    }
  }, [reachedBottom]);

  useEffect(() => {
    void (async () => {
      const { data } = await refetch();
      if (!data) return;
      setArticles((prev) => ({
        ...prev,
        data: data?.pages.flatMap((page) => page.posts),
      }));
    })();
  }, [tab]);

  return (
    <MainLayout title="Home" description="Home">
      <section className="container-main my-4 min-h-[100dvh] w-full overflow-hidden rounded-md border border-border-light bg-white dark:border-border dark:bg-primary">
        <FilterHeader />

        <ManageData
          loading={<ArticleLoading />}
          type="ARTICLE"
          error={null}
          articleData={articles}
        />

        {isFetchingNextPage &&
          Array(4)
            .fill("")
            .map((_, i) => <ArticleLoading key={i} />)}

        <div ref={bottomRef} />

        {!hasNextPage && !isFetchingNextPage && (
          <div className="flex items-center justify-center py-6">
            <h3 className="text-center text-lg text-slate-800 dark:text-slate-200">
              👋 You have reached the end 👋
            </h3>
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default Home;
