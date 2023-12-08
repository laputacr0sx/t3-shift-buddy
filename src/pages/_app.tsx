import { ClerkProvider } from "@clerk/nextjs";

import { type AppProps } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
// import { Toaster } from "~/components/Toaster";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "~/components/ui/theme-provider";
import { type NextPage } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
      <SpeedInsights />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
