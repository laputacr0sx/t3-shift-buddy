import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <div className={"sticky bottom-0 flex flex-row justify-evenly bg-red-900"}>
      <Link href={"/"} className={""}>
        Home
      </Link>
      <Link
        href={"/prefix"}
        className=" pointer-events-none text-muted-foreground"
      >
        Prefix
      </Link>
      <Link
        href={"/tester"}
        className=" pointer-events-none text-muted-foreground"
      >
        Exchange
      </Link>
    </div>
  );
}

export default Navbar;
