import React, { type ReactElement } from "react";
import { type NextPageWithLayout } from "./_app";
import Layout from "~/components/ui/layouts/AppLayout";

import { Calendar } from "~/components/ui/calendar";

const AnnualLeaves: NextPageWithLayout = () => {
  return (
    <div>
      <Calendar
        weekStartsOn={1}
        showWeekNumber
        ISOWeek
        numberOfMonths={12}
        disableNavigation
        fromYear={2024}
        onWeekNumberClick={(weekNumber, dates, e) => {
          e.preventDefault();
          console.log({ weekNumber, dates, e });
        }}
        onDayClick={(day, activeModifiers, e) => {
          e.preventDefault();
          console.log({ day, activeModifiers, e });
        }}
      />
    </div>
  );
};

AnnualLeaves.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AnnualLeaves;
