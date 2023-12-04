import Navbar from "~/components/ui/layouts/Navbar";
import { Fragment, type ReactNode } from "react";

import Head from "next/head";

interface PropType {
  children: ReactNode;
}

export default function Layout({ children }: PropType) {
  return (
    <Fragment>
      <Head>
        <title>Duty App</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="public/images/favicon.ico" />
      </Head>

      <main className="relative flex min-h-[calc(100%+3.5rem)] w-screen flex-col items-center justify-center px-4 pb-14 xs:min-h-fit xs:pb-0">
        {/* min-w-full  min-h-fit*/}
        {children}
        <Navbar />
      </main>
    </Fragment>
  );
}
