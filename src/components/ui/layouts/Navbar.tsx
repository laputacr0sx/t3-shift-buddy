import { Home, MessageCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "../../ModeToggle";

function Navbar() {
  return (
    <div className="sticky top-0 flex justify-between bg-navbar text-navbar-foreground ">
      <div className="flex flex-row justify-start gap-2 ">
        <Link href={"/"} className={"flex flex-row "}>
          <Home className="m-2" />
        </Link>
        {/* <Link
          href="whatsapp://send?text="
          className="flex flex-row text-emerald-700 dark:text-emerald-300"
        >
          <MessageCircle className="m-2 h-4 w-4 self-center" />
          <p className={"self-center text-center text-xs "}>九龍更群組</p>
        </Link> */}
        {/* <Link href={"/regdayoff"} className={"flex flex-row"}>
          <FormInput className="m-2" />
        </Link>
        <Link href={"/weekquery"} className={"flex flex-row"}>
          <CalendarDays className="m-2" />
        </Link>
        <Link href={"/wholeweek"} className={"flex flex-row"}>
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
      </Link> */}
      </div>
      <div>
        <ModeToggle />
      </div>
    </div>
  );
}

export default Navbar;
