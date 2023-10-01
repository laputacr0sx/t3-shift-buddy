import React from "react";

import { threeDigitShiftRegex } from "~/utils/regex";
import { getCompleteWeekComplex, getNextWeekDates } from "~/utils/helper";
import { api } from "~/utils/api";

function index() {
  const rawShiftsArray = ["101", "102", "103", "104", "105", "106", "RD"];

  const {
    data: currentPrefix,
    isLoading: currentPrefixLoading,
    error: currentPrefixError,
  } = api.prefixController.getCurrentPrefix.useQuery();

  if (currentPrefixLoading) {
    return (
      <div>
        <p>Loading Prefixes...</p>
      </div>
    );
  }

  if (!currentPrefix) {
    return <p>No Prefixes Loaded</p>;
  }

  if (currentPrefixError) {
    return <p>current Prefixes Error</p>;
  }

  const currentPrefixesArray = currentPrefix[0]?.prefixes ?? [];

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
    </div>
  );
}

export default index;
