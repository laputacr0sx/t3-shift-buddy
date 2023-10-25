import Navbar from "~/components/ui/layouts/Navbar";
import { type ReactNode } from "react";
import Footer from "./Footer";
import Head from "next/head";

interface PropType {
  children: ReactNode;
}

export default function Layout({ children }: PropType) {
  return (
    <>
      <Head>
        <title>Shift Buddy</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="../../public/images/Station_icon_MTR.svg" />
      </Head>
      <div className="w-screen flex-none">
        <Navbar />
      </div>
      <main className="flex min-h-screen w-auto justify-center overflow-y-hidden ">
        {children}
      </main>
      <Footer />
    </>
  );
}
