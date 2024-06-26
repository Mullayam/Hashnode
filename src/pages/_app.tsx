import { Analytics } from "@vercel/analytics/react";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import NextTopLoader from "nextjs-toploader";
import { api } from "~/utils/api";

import { ToastContainer } from "react-toastify";
import "~/styles/globals.css";
import Context from "~/utils/context";

import { MantineProvider } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import useKeyPress from "~/hooks/useKeyPress";

import Loglib from "@loglib/tracker/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useRouter } from "next/router";
import Feedback, { FeedbackForm } from "~/components/Feedback";
import SearchBody from "~/components/search/SearchBody";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleKeyPress = (): void => {
    setSearchOpen(true);
  };

  useKeyPress(handleKeyPress);

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [searchOpen]);

  const ref = useClickOutside<HTMLDivElement>(() => setSearchOpen(false));
  const [feedback, setFeedback] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (router.pathname === "/404") {
      return;
    }

    const tm = setTimeout(() => {
      setFeedback(true);
    }, 2500);

    return () => {
      clearTimeout(tm);
    };
  }, []);

  const close = () => {
    setFeedback(false);
  };

  return (
    <>
      <SessionProvider session={session}>
        <MantineProvider>
          <Context options={{ searchOpen, setSearchOpen }}>
            <ToastContainer
              closeButton={false}
              pauseOnFocusLoss={false}
              toastClassName={() =>
                "relative bg-white dark:bg-zinc-900 text-neutral-800 dark:text-white flex p-1 min-h-15 rounded-md justify-between overflow-hidden cursor-pointer p-5 border-2 dark:border-zinc-800 :dark:fill:slate-50 mb-4"
              }
            />

            <NextTopLoader color="#2563eb" />

            <Component {...pageProps} />

            {searchOpen && (
              <SearchBody
                ref={ref as React.MutableRefObject<HTMLDivElement>}
                setOpened={setSearchOpen}
              />
            )}
          </Context>
        </MantineProvider>
      </SessionProvider>

      <Analytics />
      <SpeedInsights />
      <Loglib
        config={{
          id: "hashnode-t3",
        }}
      />

      {/* Feedback Icon */}
      {!feedback && (
        <div className="feedback-div fixed bottom-5 right-5">
          <div
            onClick={() => setFeedbackForm(true)}
            className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-border-light shadow-xl dark:bg-border"
          >
            <svg
              className="fill-black dark:fill-white"
              width={30}
              height={30}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 28 32"
            >
              <path d="M28 32s-4.714-1.855-8.527-3.34H3.437C1.54 28.66 0 27.026 0 25.013V3.644C0 1.633 1.54 0 3.437 0h21.125c1.898 0 3.437 1.632 3.437 3.645v18.404H28V32zm-4.139-11.982a.88.88 0 00-1.292-.105c-.03.026-3.015 2.681-8.57 2.681-5.486 0-8.517-2.636-8.571-2.684a.88.88 0 00-1.29.107 1.01 1.01 0 00-.219.708.992.992 0 00.318.664c.142.128 3.537 3.15 9.762 3.15 6.226 0 9.621-3.022 9.763-3.15a.992.992 0 00.317-.664 1.01 1.01 0 00-.218-.707z"></path>
            </svg>
          </div>
        </div>
      )}

      {/* Feedback popup */}
      {feedback && (
        <div className="feedback-div fixed bottom-5 right-5">
          <Feedback close={close} setFeedbackForm={setFeedbackForm} />
        </div>
      )}
      {/* Feedback Form */}

      {feedbackForm && (
        <FeedbackForm setFeedbackForm={setFeedbackForm} close={close} />
      )}
    </>
  );
};

export default api.withTRPC(MyApp);
