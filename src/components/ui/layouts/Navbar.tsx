import { CalendarDays, Home, Library, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "../../ModeToggle";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "../button";

function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] h-12 bg-navbar text-navbar-foreground">
      <div className="flex justify-between">
        <div className="flex items-center justify-center">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button variant={"ghost"}>
                <User className="m-2" size={18} />
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
        <ul className="flex flex-row items-center justify-between gap-2">
          <li>
            <Link
              href={"/"}
              className={"flex flex-col items-center justify-center gap-0"}
            >
              <Home className="m-2" size={18} />
              <p className="text-[10px]">出更易</p>
            </Link>
          </li>
          <li>
            <Link
              href={"/allShifts"}
              className={"flex flex-col items-center justify-center"}
            >
              <Library className="m-2" size={18} />
              <p className="text-[10px]">搵更易</p>
            </Link>
          </li>
          <li>
            <Link
              href={"/annual"}
              className="flex flex-col items-center justify-center"
            >
              <CalendarDays className="m-2" size={18} />
              <p className="text-[10px]">日曆</p>
            </Link>
          </li>
        </ul>
        <div className="">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
