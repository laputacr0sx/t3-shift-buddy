import React from "react";
import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";
import { MessageCircle } from "lucide-react";
import { api } from "~/utils/api";
import { sevenShiftRegex, threeDigitShiftRegex } from "~/utils/regex";
import { getCompleteWeekComplex, getNextWeekDates } from "~/utils/helper";

import ShiftArrayCard from "~/components/ShiftArrayCard";

function Index() {
  const router = useRouter();

  const shiftsequence = router?.query?.shiftsequence as string;
  const rawShiftsArray = shiftsequence?.match(sevenShiftRegex);

  const { data: currentPrefix } =
    api.prefixController.getCurrentPrefix.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  const currentPrefixesArray = currentPrefix?.[0]?.prefixes || [];

  const compleShiftNameArray = currentPrefixesArray.map((prefix, index) => {
    return !threeDigitShiftRegex.test(rawShiftsArray?.[index] || "")
      ? rawShiftsArray?.[index] || ""
      : prefix.concat(rawShiftsArray?.[index] || "");
  });

  const nextWeekDates = getNextWeekDates();

  const {
    data: shiftsArray,
    isLoading: shiftsArrayLoading,
    error: shiftsArrayError,
  } = api.shiftController.getWeekShift.useQuery(
    {
      shiftArray: compleShiftNameArray,
    },
    {
      enabled: !!currentPrefixesArray && compleShiftNameArray.length > 0,
      refetchOnWindowFocus: false,
    }
  );

  if (shiftsArrayLoading) return <p>shifts are loading...</p>;

  if (shiftsArrayError) return <p>{shiftsArrayError.message}</p>;

  const nextWeekComplex = getCompleteWeekComplex(
    compleShiftNameArray,
    shiftsArray,
    nextWeekDates
  );

  if (!nextWeekComplex) return <p>loading...</p>;

  return (
    <>
      <div className="flex flex-row items-center justify-between self-center px-5 pt-4 font-mono font-extrabold">
        <div className="flex flex-col text-left">
          <h1 className="py-2 font-mono text-xl font-extrabold tracking-widest">
            以下為第{currentPrefix?.[0]?.weekNumber}週更資料
          </h1>
          <p className="text-sm text-muted-foreground">點擊更號以複製資料</p>
        </div>
        <div>
          <Link
            href={""}
            className={"pointer-events-none flex flex-row text-red-300"}
          >
            <MessageCircle className="m-2 h-4 w-4" />
            <p className={"self-center text-center text-sm "}>九龍更群組</p>
          </Link>
          <Link
            href={""}
            className={"pointer-events-none flex flex-row text-blue-300"}
          >
            <MessageCircle className="m-2 h-4 w-4" />
            <p className={"self-center text-center text-sm "}>上水更群組</p>
          </Link>
        </div>
      </div>
      <p className={"px-5 text-right align-middle text-muted-foreground"}>
        Timetable updated {moment(currentPrefix?.[0]?.updatedAt).fromNow()}
      </p>

      {nextWeekComplex?.map((eachDay) => (
        <ShiftArrayCard
          date={eachDay.date}
          dutyObject={eachDay.dutyObject}
          title={eachDay.title}
          key={JSON.stringify(eachDay.dutyObject)}
        />
      ))}
    </>
  );
}

export default Index;
