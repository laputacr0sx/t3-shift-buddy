import React from "react";
import ChineseCalendar from "~/components/ChineseCalendar";
import ShiftAccordion from "~/components/ShiftAccordion";
import { api } from "~/utils/api";

function index() {
  const { data: shiftData } = api.getShifts.getShiftGivenDutyNumber.useQuery({
    duty: "101",
  });

  return (
    <div className="w-full">
      <ShiftAccordion />
      {shiftData &&
        shiftData.map((shift) => (
          <ChineseCalendar key={shift.id} shift={shift} />
        ))}
    </div>
  );
}

export default index;
