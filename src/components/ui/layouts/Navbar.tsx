import {
  ArrowLeftRight,
  CalendarDays,
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
  // const { isSignedIn } = useUser();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] flex h-12 items-center justify-between bg-navbar text-navbar-foreground">
      {/* <div className="mx-2 self-center align-middle">
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <SignInButton mode="modal">
            <UserCircle2 />
          </SignInButton>
        )}
      </div> */}
      <ul className="flex flex-row justify-center gap-2 ">
        <li>
          <Link
            href={"/"}
            className={"flex flex-col items-center justify-center gap-0"}
          >
            <Home className="m-2" size={18} />
            <p className="text-[10px]">首頁</p>
          </Link>
        </li>
        <li>
          <Link
            href={"/allShifts"}
            className={"flex flex-col items-center justify-center"}
          >
            <Table className="m-2" size={18} />
            <p className="text-[10px]">更餡</p>
          </Link>
        </li>
        <li>
          <Link
            href={"/annual"}
            className={"flex flex-col items-center justify-center"}
          >
            <CalendarDays className="m-2" size={18} />
            <p className="text-[10px]">日曆</p>
          </Link>
        </li>
      </ul>
      <div className="flex h-10">
        <ModeToggle />
      </div>
    </div>
  );
}

export default Navbar;
