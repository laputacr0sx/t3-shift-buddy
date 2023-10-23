import React from "react";
import { AllShiftsColumns } from "~/components/ShiftTable/AllShiftsColumns";
import { AllShiftsTable } from "~/components/ShiftTable/AllShiftsTable";
import { api } from "~/utils/api";

function AllShifts() {
  const {
    data: allShifts,
    isLoading: shiftsLoading,
    error: shiftsError,
  } = api.shiftController.getAllShifts.useQuery();

  if (shiftsLoading) return <>Loading Page</>;

  if (shiftsError) return <>{shiftsError.message}</>;

  return <AllShiftsTable columns={AllShiftsColumns} data={allShifts} />;
}

export default AllShifts;
