import PrefixChangingForm from "../components/PrefixChangingForm";
import { Skeleton } from "~/components/ui/skeleton";

import { api } from "~/utils/api";

import { autoPrefix, getNextWeekDates, getWeekNumber } from "~/utils/helper";
import { type NextPageWithLayout } from "./_app";
import { type ReactElement } from "react";
import Layout from "~/components/ui/layouts/AppLayout";
import DynamicUpdatePrefixForm from "~/components/PrefixUpdateForm";

const PrefixUpdateForm: NextPageWithLayout = () => {
  const weekNumber = getWeekNumber();

  const {
    data: currentWeekPreix,
    isLoading: currentWeekPrefixLoading,
    error: currenWeekPrefixError,
  } = api.prefixController.getPrefixGivenWeekNumber.useQuery({
    weekNumber: weekNumber,
  });

  if (currentWeekPrefixLoading)
    return (
      <>
        <Skeleton className={"h-3 w-10 rounded-md"} />
      </>
    );

  if (currenWeekPrefixError) {
    return <>{currenWeekPrefixError.message}</>;
  }

  return (
    <div>
      <h1 className="justify-center py-5 text-center text-4xl font-semibold text-foreground">
        改更易
      </h1>
      {currentWeekPreix.error && (
        <p className="text-center text-red-500">
          {currentWeekPreix.error.message}
        </p>
      )}
      <h2 className="justify-center py-2 text-center font-mono text-xl font-semibold text-foreground">
        {`第${weekNumber}週時間表`}
      </h2>
      <div className="flex items-center justify-center gap-4">
        {/* <PrefixChangingForm
          dates={getNextWeekDates()}
          weekPrefix={currentWeekPreix.result}
        /> */}

        <DynamicUpdatePrefixForm
          dates={getNextWeekDates()}
          weekPrefix={currentWeekPreix.result}
          autoPrefix={autoPrefix()}
        />
      </div>
    </div>
  );
};

PrefixUpdateForm.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PrefixUpdateForm;