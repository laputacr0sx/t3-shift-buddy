import { CalendarDays, FormInput, Home } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { ModeToggle } from "../../ModeToggle";

function Navbar() {
  return (
    // <NavigationMenu>
    //   <NavigationMenuList>
    //     <NavigationMenuItem>
    //       <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
    //       <NavigationMenuContent>
    //         <NavigationMenuLink>Link</NavigationMenuLink>
    //       </NavigationMenuContent>
    //     </NavigationMenuItem>
    //   </NavigationMenuList>
    // </NavigationMenu>

    <div
      className={
        "sticky top-0 flex justify-between bg-navbar text-navbar-foreground "
      }
    >
      <div className="flex flex-row justify-start gap-2 ">
        <Link href={"/"} className={"flex flex-row "}>
          <Home className="m-2" />
        </Link>
        <Link href={"/regdayoff"} className={"flex flex-row"}>
          <FormInput className="m-2" />
        </Link>
        <Link href={"/weekquery"} className={"flex flex-row"}>
          <CalendarDays className="m-2" />
        </Link>
        <Link href={"/wholeweek"} className={"flex flex-row"}>
          <CalendarDays className="m-2" />
        </Link>
        {/* <Link
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
