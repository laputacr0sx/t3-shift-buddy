import React from "react";
import { Skeleton } from "./ui/skeleton";

function TableLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 pt-5">
      <Skeleton className="h-14 w-40 " />

      <Skeleton className="h-screen w-80" />
    </div>
  );
}

export default TableLoading;
