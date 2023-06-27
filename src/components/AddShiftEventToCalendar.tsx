import React from "react";
import { AddToCalendarButton } from "add-to-calendar-button-react";

function AddShiftEventToCalendar() {
  return (
    <>
      <AddToCalendarButton
        name="Title"
        options="'Apple','Google'"
        location="World Wide Web"
        startDate="2023-06-30"
        endDate="2023-06-30"
        startTime="10:15"
        endTime="23:30"
        timeZone="America/Los_Angeles"
      ></AddToCalendarButton>
    </>
  );
}

export default AddShiftEventToCalendar;
