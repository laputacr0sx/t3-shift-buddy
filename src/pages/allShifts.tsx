import { AllShiftsColumns } from "~/components/ShiftTable/AllShiftsColumns";
import { AllShiftsTable } from "~/components/ShiftTable/AllShiftsTable";
import { api } from "~/utils/api";
import { type NextPageWithLayout } from "./_app";
import { type ReactElement } from "react";
import Layout from "~/components/ui/layouts/AppLayout";
import TableLoading from "~/components/TableLoading";

const AllShifts: NextPageWithLayout = () => {
  const {
    data: allShifts,
    isLoading: shiftsLoading,
    error: shiftsError,
  } = api.shiftController.getAllShifts.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  // const {
  //   data: allShifts,
  //   isLoading: shiftsLoading,
  //   error: shiftsError,
  // } = api.shiftController.getAllShiftsWithInfinite.useQuery(
  //   { limit: 10, cursor: null },
  //   {
  //     refetchOnWindowFocus: false,
  //     getNextPageParam: (lastPage) => lastPage.nextCursor,
  //   }
  // );

  if (shiftsLoading) return <TableLoading />;

  if (shiftsError) return <>{shiftsError.message}</>;

  return (
    <div className="flex h-full w-screen flex-col gap-4 py-2">
      {/* <Slider
        defaultValue={[7]}
        min={6}
        max={8.25}
        step={0.25}
        disabled
        className="py-2"
      /> */}

      <AllShiftsTable columns={AllShiftsColumns} data={allShifts} />
    </div>
  );
};

AllShifts.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AllShifts;
