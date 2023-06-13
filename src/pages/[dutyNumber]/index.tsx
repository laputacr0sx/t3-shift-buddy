import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";
import ShiftCard from "../component/ShiftCard";
import { Skeleton } from "~/component/ui/skeleton";

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
    <div>
      <div className="flex-row justify-center overflow-scroll px-5">
        {shiftData?.map((shiftDetail) => (
          <ShiftCard key={shiftDetail.id} shift={shiftDetail} />
        ))}
      </div>
    </div>
  );
}

export default Index;
