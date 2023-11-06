import React, { useState, type ReactElement } from "react";
import { type NextPageWithLayout } from "./_app";
import Layout from "~/components/ui/layouts/AppLayout";

import { Calendar } from "~/components/ui/calendar";
import moment from "moment";
import { Button } from "~/components/ui/button";
import { Minus, Plus, RotateCcw } from "lucide-react";

const AnnualLeaves: NextPageWithLayout = () => {
  const [year, setYear] = useState(moment().year());

  return (
    <div>
      <h1 className="justify-center py-5 text-center text-4xl font-semibold text-foreground">
        大假易
      </h1>
      {/* <div className="flex items-center justify-center pt-2 font-mono font-extrabold">
        年份
        <Button
          onClick={() => {
            setYear(() => {
              return year - 1;
            });
          }}
        >
          <Minus size={20} />
        </Button>
        {year}
        <Button
          onClick={() => {
            setYear(() => {
              return year + 1;
            });
          }}
        >
          <Plus size={20} />
        </Button>
        <Button
          onClick={() => {
            setYear(() => {
              return moment().year();
            });
          }}
        >
          <RotateCcw size={20} />
        </Button>
      </div> */}
      <Calendar
        className=""
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
        formatters={{
          formatWeekNumber: (weekNumber) => (
            <p className="flex items-center justify-center self-center text-center align-middle">
              W{weekNumber}
            </p>
          ),
        }}
      />
    </div>
  );
};

AnnualLeaves.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AnnualLeaves;
