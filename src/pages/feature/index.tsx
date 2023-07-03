import React from "react";

import ResponsiveShiftCard from "~/components/ResponsiveShiftCard";
import { threeDigitShiftRegex } from "~/lib/regex";
import { getCompleteWeekComplex, getNextWeekDates } from "~/lib/utils";
import { api } from "~/utils/api";

function index() {
  const rawShiftsArray = ["101", "102", "103", "104", "105", "106", "RD"];

  const { data: currentPrefix } =
    api.prefixController.getCurrentPrefix.useQuery();

  const currentPrefixesArray = currentPrefix?.[0]?.prefixes ?? [];

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
    <div>
      <h1>This is the calendar feature</h1>

      {nextWeekComplex?.map((eachDay) => (
        <ResponsiveShiftCard
          date={eachDay.date}
          dutyObject={eachDay.dutyObject}
          title={eachDay.title}
          key={JSON.stringify(eachDay.dutyObject)}
        />
      ))}
    </div>
  );
}

export default index;
