import { Home } from "lucide-react";
import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <div className={"sticky bottom-0 flex flex-row justify-evenly bg-red-900"}>
      <Link href={"/"} className={"flex flex-row"}>
        <Home className="m-2" />
      </Link>
      <Link
        href={"/prefix"}
        className=" pointer-events-none m-2 text-muted-foreground"
      >
        Prefix
      </Link>
      <Link
        href={"/tester"}
        className=" pointer-events-none m-2 text-muted-foreground"
      >
        Exchange
      </Link>
    </div>
  );
}

export default Navbar;
