import Navbar from "~/components/Navbar";
import { type ReactNode } from "react";

interface PropType {
  children: ReactNode;
}

export default function Layout({ children }: PropType) {
  return (
    <div className="flex flex-col">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
