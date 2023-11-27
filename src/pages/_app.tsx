import { ClerkProvider } from "@clerk/nextjs";

import { type AppProps } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
// import { Toaster } from "~/components/Toaster";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "~/components/ui/theme-provider";
import { type NextPage } from "next";
import moment from "moment";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  // moment.updateLocale("zh-hk", {
  //   weekdaysShort: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
  //   weekdaysMin: ["日", "一", "二", "三", "四", "五", "六"],
  // });

  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    // <ClerkProvider {...pageProps}>
    <>
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
    </>

    // </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
