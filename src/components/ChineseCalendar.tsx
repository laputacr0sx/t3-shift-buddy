import React from "react";
import moment from "moment";

interface PropType {
  date: Date;
}

function ChineseCalendar(props: PropType) {
  const { date } = props;
  const localDateTime = moment(date).locale("tc");

  return (
    <div className="min-w-32 min-h-32 mb-4 flex items-center justify-center rounded-2xl p-3 font-medium">
      <div className="w-20 flex-none rounded-t text-center shadow-lg md:w-32 lg:rounded-l lg:rounded-t-none ">
        <div className="block overflow-hidden rounded-t text-center text-primary-foreground ">
          <div className="bg-blue-500 py-1 dark:bg-blue-900">
            {localDateTime.format("MMM")}
          </div>
          <div className="border-l border-r border-border bg-card pt-1">
            <span className="text-5xl font-bold leading-tight">
              {moment(date).date()}
            </span>
          </div>
          <div className="-pt-2 mb-1 rounded-b-lg border-b border-l border-r border-border bg-card text-center">
            <span className="text-sm">{localDateTime.format("dddd")}</span>
          </div>

          {/* <div className="rounded-b-lg border-b border-l border-r border-border bg-white pb-2 text-center">
            <span className="text-xs leading-normal">8:00 am to 5:00 pm</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default ChineseCalendar;
