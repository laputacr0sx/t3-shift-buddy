import { Home, CalendarDays, Table2, Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <div className={"sticky bottom-0 flex flex-row justify-evenly bg-red-900"}>
      <Link href={"/"} className={"flex flex-row"}>
        <Home className="m-2" />
      </Link>
      <Link href={"/weekquery"} className={"flex flex-row"}>
        <CalendarDays className="m-2" />
      </Link>
      <Link
        href={"/tester"}
        className=" pointer-events-none  text-muted-foreground"
      >
        <Table2 className="m-2" />
      </Link>
      <Link
        href={"/prefix"}
        className=" pointer-events-none  text-muted-foreground"
      >
        <Pencil className="m-2" />
      </Link>
    </div>
  );
}

export default Navbar;
