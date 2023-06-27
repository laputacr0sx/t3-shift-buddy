import React, { useEffect, useState } from "react";

import { AddToCalendarButton } from "add-to-calendar-button-react";

function AddShiftEventToCalendar() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <>
      {hydrated && (
        <AddToCalendarButton
          name="Event Series"
          dates='[
          {
            "name":"Reminder 1/3 to test the Add to Calendar Button",
            "description":"This is the first part to check the Add to Calendar Button script at [url]https://add-to-calendar-button.com/[/url]",
            "startDate":"today+3",
            "startTime":"10:15",
            "endTime":"23:30"
          },
          {
            "name":"Reminder 3/3 to test the Add to Calendar Button",
            "description":"This is the third part to check the Add to Calendar Button script at [url]https://add-to-calendar-button.com/[/url]",
            "startDate":"today+8",
            "startTime":"09:00",
            "endTime":"19:00"
          },
          {
            "name":"Reminder 2/3 to test the Add to Calendar Button",
            "description":"This is the second part to check the Add to Calendar Button script at [url]https://add-to-calendar-button.com/[/url]",
            "startDate":"today+5",
            "startTime":"11:30",
            "endTime":"20:00"
          }
        ]'
          timeZone="Beijing"
          options={["Apple", "Google", "iCal", "Outlook.com"]}
          lightMode="bodyScheme"
        ></AddToCalendarButton>
      )}
    </>
  );
}

export default AddShiftEventToCalendar;
