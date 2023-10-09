import Navbar from "~/components/ui/layouts/Navbar";
import { type ReactNode } from "react";
import Footer from "./Footer";

interface PropType {
  children: ReactNode;
}

export default function Layout({ children }: PropType) {
  return (
    <>
      <div className="w-screen flex-none">
        <Navbar />
      </div>
      <div className="flex h-fit min-h-screen flex-col overflow-hidden">
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}
