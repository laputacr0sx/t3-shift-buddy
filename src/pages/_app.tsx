import { ClerkProvider } from "@clerk/nextjs";

import { type AppProps } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "~/components/Toaster";
import { ThemeProvider } from "~/components/ui/theme-provider";
import { type NextPage } from "next";

// export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
//   getLayout?: (page: ReactElement) => ReactNode;
// };

// type AppPropsWithLayout<P> = AppProps<P> & {
//   Component: NextPageWithLayout<P>;
// };

// const MyApp = ({
//   Component,
//   pageProps,
// }: AppPropsWithLayout<{ session: Session | null }>) => {
//   const getLayout = Component.getLayout ?? ((page) => page);

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster />
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
      <Analytics />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
