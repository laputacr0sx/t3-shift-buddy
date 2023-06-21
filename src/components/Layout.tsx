import Navbar from "~/components/Navbar";
import { type ReactNode } from "react";

interface PropType {
  children: ReactNode;
}

export default function Layout({ children }: PropType) {
  return (
    <div className="">
      <main>{children}</main>
      <Navbar />
    </div>
  );
}