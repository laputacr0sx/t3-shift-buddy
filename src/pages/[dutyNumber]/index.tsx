import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

function Index() {
  const router = useRouter();
  const { dutyNumber } = router.query;

  const {
    data: shiftData,
    isLoading,
    error,
  } = api.getShifts.findShift.useQuery({
    duty: "111",
  });

  return (
    <div>
      <div>{dutyNumber}</div>
      <div>{JSON.stringify(shiftData)}</div>
    </div>
  );
}

export default Index;
