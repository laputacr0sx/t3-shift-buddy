import { Home } from "lucide-react";
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

    <div className={"sticky top-0 flex flex-row justify-start bg-red-950"}>
      <Link href={"/"} className={"flex flex-row"}>
        <Home className="m-2" />
      </Link>
      {/* <Link href={"/weekquery"} className={"flex flex-row"}>
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
  );
}

export default Navbar;
