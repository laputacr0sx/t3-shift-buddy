import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";
import { Toaster } from "~/components/Toaster";
import Script from "next/script";
import { ThemeProvider } from "~/components/ui/theme-provider";
import { type ReactElement, type ReactNode } from "react";
import { type NextPage } from "next";

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout<P> = AppProps<P> & {
  Component: NextPageWithLayout<P>;
};

const MyApp = ({
  Component,
  pageProps,
}: AppPropsWithLayout<{ session: Session | null }>) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>VV Shift Buddy</title>
      </Head>
      <Script
        src="https://cdn.jsdelivr.net/npm/add-to-calendar-button@2"
        async
        defer
      ></Script>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
      <Toaster />
      <Analytics />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
