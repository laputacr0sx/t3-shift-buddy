import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <div className={"flex flex-col justify-evenly"}>
      <Link href={"/"}>Home</Link>
      <Link href={"/prefix"}>Prefix</Link>
      <Link href={"/tester"}>Exchange</Link>
    </div>
  );
}

export default Navbar;
