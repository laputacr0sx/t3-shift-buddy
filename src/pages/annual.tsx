import React, { useState, type ReactElement, useMemo } from "react";
import { type NextPageWithLayout } from "./_app";
import Layout from "~/components/ui/layouts/AppLayout";

import { Calendar } from "~/components/ui/calendar";
import moment from "moment";
import { Button } from "~/components/ui/button";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { toast } from "~/components/ui/useToast";
import { autoPrefix } from "~/utils/helper";
import { cn } from "~/lib/utils";
import holidayJson from "~/utils/holidayHK";
import fixtures from "~/utils/hkjcFixture";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

const AnnualLeaves: NextPageWithLayout = () => {
  const [year, setYear] = useState(moment().year());
  const memoizedPublicHolidays = useMemo(
    () => (formattedDate: string) =>
      holidayJson.vcalendar
        .flatMap(({ vevent }) =>
          vevent.flatMap(({ dtstart }) =>
            dtstart.filter((date) => typeof date === "string")
          )
        )
        .filter((holiday) => holiday === formattedDate)[0],
    []
  );

  const memoizedPublicHolidayDetails = useMemo(
    () => (formattedDate: string) =>
      holidayJson.vcalendar[0]?.vevent.filter(({ dtstart }) =>
        dtstart.includes(formattedDate)
      )[0],
    []
  );

  const memoizedRacingDetails = useMemo(
    () => (formattedDate: string) =>
      fixtures.filter(({ date: fixtureDate }) => {
        const formatedFixtureDate = moment(fixtureDate)
          .locale("zh-hk")
          .format("YYYYMMDD");
        return formatedFixtureDate === formattedDate;
      })[0],
    []
  );

  return (
    <div className="relative">
      <h1 className="justify-center py-5 text-center text-4xl font-semibold text-foreground">
        大假易
      </h1>
      <Card className="absolute right-4 top-4 flex h-10 w-16 flex-col items-start justify-center border-0 px-2">
        <section className="flex items-center justify-center gap-2 align-middle">
          <Separator className="w-4  border-2 border-lime-400 bg-lime-400" />
          <p className="text-[6px] text-lime-400">日馬</p>
        </section>
        <section className="flex items-center justify-center gap-2 align-middle">
          <Separator className="w-4  border-2 border-indigo-400 bg-indigo-400" />
          <p className="text-[6px] text-indigo-400">夜馬</p>
        </section>
        <section className="flex items-center justify-center gap-2 align-middle">
          <Separator className="w-4  border-2 border-amber-400 bg-amber-400" />
          <p className="text-[6px] text-amber-400">黃昏馬</p>
        </section>
      </Card>
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
        weekStartsOn={1}
        showWeekNumber
        ISOWeek
        numberOfMonths={12}
        disableNavigation
        fromYear={2024}
        toYear={2024}
        onWeekNumberClick={(weekNumber, dates, e) => {
          e.preventDefault();
          toast({
            description: `已選 第${weekNumber}週`,
          });
        }}
        formatters={{
          formatDay: (date) => {
            const formattedDate = moment(date)
              .locale("zh-hk")
              .format("YYYYMMDD");

            const holidayDetails = memoizedPublicHolidayDetails(formattedDate);
            const racingDetails = memoizedRacingDetails(formattedDate);

            return (
              <section
                className={cn(
                  "flex flex-col items-center justify-center text-center",
                  (holidayDetails ||
                    date.getDay() === 0 ||
                    date.getDay() === 6) &&
                    "text-red-800 dark:text-red-400",
                  racingDetails?.nightRacing === 0
                    ? "border-b-2 border-b-lime-500 dark:border-b-lime-300"
                    : racingDetails?.nightRacing === 1
                    ? "border-b-2 border-b-indigo-500 dark:border-b-indigo-300"
                    : racingDetails?.nightRacing === 2
                    ? "border-b-2 border-b-amber-500 dark:border-b-amber-300"
                    : ""
                )}
              >
                <p>{date.getDate()}</p>
                <p className="text-[6px]">{holidayDetails?.summary}</p>
              </section>
            );
          },

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
