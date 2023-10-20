import { ClerkProvider } from "@clerk/nextjs";

import { type Session } from "next-auth";
import { type AppProps } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";
import { Toaster } from "~/components/Toaster";
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
    <ClerkProvider {...pageProps}>
      <Head>
        <title>VV Shift Buddy</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
      <Toaster />
      <Analytics />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
