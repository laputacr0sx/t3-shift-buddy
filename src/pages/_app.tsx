import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";
import { Toaster } from "~/components/Toaster";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>VV Shift Buddy</title>
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/x-icon" href="../../public/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      <Toaster />
      <Analytics />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
