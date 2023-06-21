import { type Shifts } from "@prisma/client";
import React from "react";
import moment from "moment";

interface PropType {
  shift: Shifts;
}

function ChineseCalendar(props: PropType) {
  console.log(moment(new Date()));
  return (
    <div className="min-w-32 min-h-48 mb-4 bg-white p-3 font-medium">
      <div className="w-32 flex-none rounded-t text-center shadow-lg lg:rounded-l lg:rounded-t-none ">
        <div className="block overflow-hidden rounded-t  text-center ">
          <div className="bg-blue-500 py-1 text-white">
            {props.shift.dutyNumber}
          </div>
          <div className="border-l border-r border-white bg-white pt-1">
            <span className="text-5xl font-bold leading-tight">{}</span>
          </div>
          <div className="-pt-2 -mb-1 rounded-b-lg border-b border-l border-r border-white bg-white text-center">
            <span className="text-sm">Sunday</span>
          </div>
          <div className="rounded-b-lg border-b border-l border-r border-white bg-white pb-2 text-center">
            <span className="text-xs leading-normal">
              {props.shift.bNT} to {props.shift.bFT}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChineseCalendar;
