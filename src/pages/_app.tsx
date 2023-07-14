import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";
import { Toaster } from "~/components/Toaster";
import Layout from "~/components/Layout";
import Script from "next/script";
import { ThemeProvider } from "~/components/ui/theme-provider";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>VV Shift Buddy</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        <link rel="icon" type="image/x-icon" href="../../public/favicon.ico" />
      </Head>
      <Script
        src="https://cdn.jsdelivr.net/npm/add-to-calendar-button@2"
        async
        defer
      ></Script>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>

      <Toaster />
      <Analytics />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
