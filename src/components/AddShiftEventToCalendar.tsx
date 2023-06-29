import React, { useEffect, useState } from "react";

import { AddToCalendarButton } from "add-to-calendar-button-react";

import { RouterOutputs } from "~/utils/api";

type DEMO_Shift = RouterOutputs["shiftController"]["getWeekShift"][number];

interface PropType {
  date: Date | undefined;
  title: string | undefined;
  dutyObject: DEMO_Shift | undefined;
}

const DUMMY: DEMO_Shift = {
  dutyNumber: "D15101",
  bNL: "HUH",
  bNT: "04:05",
  bFT: "11:35",
  bFL: "HUH",
  duration: "7:00",
  remarks: "EMU",
  id: "",
};

function AddShiftEventToCalendar(props: PropType) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <>
      {hydrated && (
        <AddToCalendarButton
          name="My awesome Event"
          startDate="today+1"
          options={["Apple", "Google", "iCal"]}
          startTime="10:10"
          endTime="10:40"
          timeZone="Asia/Chongqing"
          location="Fantasy Marketplace"
          buttonStyle="date"
          size="5"
          lightMode="bodyScheme"
        ></AddToCalendarButton>
      )}
    </>
  );
}

export default AddShiftEventToCalendar;
