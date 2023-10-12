import { Home } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "../../ModeToggle";
import { UserButton } from "@clerk/nextjs";

function Navbar() {
  return (
    <div className="sticky top-0 flex justify-between bg-navbar text-navbar-foreground ">
      <div className="flex flex-row justify-start gap-2 ">
        <Link href={"/"} className={"flex flex-row "}>
          <Home className="m-2" />
        </Link>
      </div>
      <div className="self-center align-middle">
        <UserButton afterSignOutUrl="/" />
      </div>
      <div>
        <ModeToggle />
      </div>
    </div>
  );
}

export default Navbar;
