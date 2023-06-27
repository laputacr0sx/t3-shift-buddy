import React from "react";

import AddShiftEventToCalendar from "~/components/AddShiftEventToCalendar";

const eventData = {
  name: "Title",
  options: ["Apple", "Google"],
  location: "World Wide Web",
  startDate: "2023-06-30",
  endDate: "2023-06-30",
  startTime: "10:15",
  endTime: "23:30",
  timeZone: "America/Los_Angeles",
};

function index() {
  return (
    <div>
      <h1>This is the calendar feature</h1>
      <AddShiftEventToCalendar />
    </div>
  );
}

export default index;
