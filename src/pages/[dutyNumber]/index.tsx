import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";
import ShiftCard from "../../component/ShiftCard";
import { Skeleton } from "~/component/ui/skeleton";
import { Button } from "~/component/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

function Index() {
  const router = useRouter();
  const dutyNumber = router.query.dutyNumber as string;

  const {
    data: shiftData,
    isLoading: loadingShiftData,
    error: errorShiftData,
  } = api.getShifts.findShift.useQuery(
    {
      duty: dutyNumber,
    },
    { enabled: !!router.query.dutyNumber, refetchOnWindowFocus: false }
  );

  if (loadingShiftData) {
    return (
      <div className="flex items-center space-x-4 p-14">
        <Skeleton className=" h-12 w-12 rounded-sm" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (errorShiftData?.data?.code === "BAD_REQUEST") {
    return (
      <div>
        <h1>Bad Request, Please try again</h1>
      </div>
    );
  }

  if (Array.isArray(shiftData) && !shiftData?.length) {
    return <div>Missing duty data ...</div>;
  }

  return (
    <>
      <div className="flex flex-row justify-evenly px-5 pt-4 text-center font-mono font-extrabold">
        <Link href={"/"}>
          <Button variant={"default"}>
            <Home className="m-2 h-4 w-4" />
            返回
          </Button>
        </Link>
        <h1 className="px-4 py-2 text-xl">以下為{dutyNumber}更資料</h1>
      </div>
      {shiftData?.map((shiftDetail) => (
        <ShiftCard key={shiftDetail.id} shift={shiftDetail} />
      ))}
    </>
  );
}

export default Index;
