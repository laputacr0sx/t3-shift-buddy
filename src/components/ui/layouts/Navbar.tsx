import {
  ArrowLeftRight,
  FlaskConical,
  Home,
  Table,
  UserCircle2,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "../../ModeToggle";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <div className="sticky top-0 flex justify-between bg-navbar text-navbar-foreground ">
      <div className="mx-2 self-center align-middle">
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <SignInButton mode="modal">
            <UserCircle2 />
          </SignInButton>
        )}
      </div>
      <ul className="flex flex-row justify-start gap-2 ">
        <li>
          <Link href={"/"} className={"flex flex-row "}>
            <Home className="m-2" />
          </Link>
        </li>
        <li>
          <Link href={"/allShifts"} className={"flex flex-row "}>
            <Table className="m-2" />
          </Link>
        </li>
        <li>
          <Link href={"/exchange"} className={"flex flex-row "}>
            <ArrowLeftRight className="m-2" />
          </Link>
        </li>
        <li>
          <Link href={"/feature"} className={"flex flex-row "}>
            <FlaskConical className="m-2" />
          </Link>
        </li>
      </ul>
      <div>
        <ModeToggle />
      </div>
    </div>
  );
}

export default Navbar;
