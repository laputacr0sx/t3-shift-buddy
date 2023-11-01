import Navbar from "~/components/ui/layouts/Navbar";
import { Fragment, type ReactNode } from "react";
import Footer from "./Footer";
import Head from "next/head";

interface PropType {
  children: ReactNode;
}

export default function Layout({ children }: PropType) {
  return (
    <Fragment>
      <Head>
        <title>Shift Buddy</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="../../public/images/Station_icon_MTR.svg" />
      </Head>
      {/* <div className="w-screen flex-none"> */}
      {/* <main className="flex h-auto w-auto items-start justify-center"> */}
      {/* <main className="h-full min-h-screen w-screen"> */}
      <main className="relative flex min-h-[calc(100vh-64px)] w-auto items-start justify-center">
        <Navbar />
        {children}
      </main>
      {/* <Footer /> */}
    </Fragment>
  );
}
