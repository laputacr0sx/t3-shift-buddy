import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";
import ShiftCard from "../component/ShiftCard";

function Index() {
  const router = useRouter();
  const dutyNumber = router.query.dutyNumber as string;

  const {
    data: shiftData,
    isLoading,
    error,
  } = api.getShifts.findShift.useQuery(
    {
      duty: dutyNumber,
    },
    { enabled: !!router.query.dutyNumber, refetchOnWindowFocus: false }
  );

  if (isLoading) {
    return <div>Loading shift data...</div>;
  }

  if (error?.data?.code === "BAD_REQUEST") {
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
      <div className="m-4 flex h-auto w-auto flex-row justify-center px-5 align-middle">
        {shiftData?.map((shiftDetail) => (
          <ShiftCard key={shiftDetail.id} shift={shiftDetail} />
        ))}
      </div>
    </div>
  );
}

export default Index;
