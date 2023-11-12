import PrefixChangingForm from "../components/PrefixChangingForm";
import { Skeleton } from "~/components/ui/skeleton";

import { api } from "~/utils/api";

import { autoPrefix, getNextWeekDates, getWeekNumber } from "~/utils/helper";
import { type NextPageWithLayout } from "./_app";
import { useEffect, type ReactElement, useState } from "react";
import Layout from "~/components/ui/layouts/AppLayout";
import DynamicUpdatePrefixForm from "~/components/PrefixUpdateForm";

const PrefixUpdate: NextPageWithLayout = () => {
  const [currentWeekNumber, setCurrentWeekNumber] = useState(getWeekNumber());

  useEffect(() => {
    const weekNumber = getWeekNumber();

    setCurrentWeekNumber(weekNumber);
  }, [currentWeekNumber]);

  return (
    <div>
      <h1 className="justify-center py-5 text-center text-4xl font-semibold text-foreground">
        改更易
      </h1>

      <div className="flex items-center justify-center gap-4">
        {/* <PrefixChangingForm
          dates={getNextWeekDates()}
          weekPrefix={currentWeekPreix.result}
        /> */}

        <DynamicUpdatePrefixForm
          currentWeekNumber={currentWeekNumber}
          dates={getNextWeekDates()}
          autoPrefix={autoPrefix()}
        />
      </div>
    </div>
  );
};

PrefixUpdate.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PrefixUpdate;
