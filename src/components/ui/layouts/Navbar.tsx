import { CalendarDays, Home, Library, Table } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "../../ModeToggle";

function Navbar() {
  // const { isSignedIn } = useUser();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] flex h-12 justify-center bg-navbar text-navbar-foreground">
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
        {/* <li>
          <Link
            href={"/weekdetails"}
            className={"flex flex-col items-center justify-center"}
          >
            <Table className="m-2" size={18} />
            <p className="text-[10px]">首頁</p>
          </Link>
        </li> */}
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
      <div className="absolute right-0">
        <ModeToggle />
      </div>
    </div>
  );
}

export default Navbar;
