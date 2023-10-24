import { AllShiftsColumns } from "~/components/ShiftTable/AllShiftsColumns";
import { AllShiftsTable } from "~/components/ShiftTable/AllShiftsTable";
import { api } from "~/utils/api";
import { type NextPageWithLayout } from "./_app";
import { type ReactElement } from "react";
import Layout from "~/components/ui/layouts/AppLayout";

const AllShifts: NextPageWithLayout = () => {
  const {
    data: allShifts,
    isLoading: shiftsLoading,
    error: shiftsError,
  } = api.shiftController.getAllShifts.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  if (shiftsLoading) return <>Loading Page</>;

  if (shiftsError) return <>{shiftsError.message}</>;

  return (
    <div className="h-full w-screen py-12">
      <AllShiftsTable columns={AllShiftsColumns} data={allShifts} />;
    </div>
  );
};

AllShifts.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AllShifts;
