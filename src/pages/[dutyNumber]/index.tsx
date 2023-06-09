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
  } = api.getShifts.findShift.useQuery({
    duty: dutyNumber,
  });

  if (isLoading) {
    return <div>Loading shift data...</div>;
  }

  if (error) throw new Error(error.message);

  return (
    <div>
      <div className="m-4 flex h-auto w-auto flex-row justify-center px-5 align-middle">
        {shiftData?.map((shiftDetail) => {
          return <ShiftCard key={shiftDetail.id} shift={shiftDetail} />;
        })}
      </div>
    </div>
  );
}

export default Index;
