// app/api/calendar/route.ts

import type { NextApiRequest, NextApiResponse } from "next";
import icalendar, { type ICalEventData } from "ical-generator";
import moment from "moment";

import { type DayDetail } from "~/utils/customTypes";
import { convertDurationDecimal } from "~/utils/helper";

function getICSObject(selectedShifts: DayDetail[]): ICalEventData[] {
  return selectedShifts.map<ICalEventData>((shift) => {
    const { date, bFL, bFT, bNL, bNT, duration, dutyNumber, remarks } = shift;
    const validDate = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");

    const start = moment(`${validDate} ${bNT}`);
    const end = moment(`${validDate} ${bFT}`).isAfter(
      moment(`${validDate} ${bNT}`)
    )
      ? moment(`${validDate} ${bFT}`)
      : moment(`${validDate} ${bFT}`).add(1, "d");
    const durationDecimal = duration
      ? convertDurationDecimal(duration)
      : duration;

    return {
      start: start,
      end: end,
      title: dutyNumber,
      description: `收工地點：${bFL}\n工時：${durationDecimal}\n備註：${remarks}`,
      location: bNL,
      sequence: 1,
    };
  });
}

export default function handler(req: NextApiRequest) {
  // if (req.method !== "GET") {
  //   return new Response("Method Not Allowed", {
  //     headers: { Allow: "GET" },
  //     status: 405,
  //   });
  // }

  // const events = getICSObject(req.body.shifts as Row<DayDetail>[]);

  // const TestSchema = z.instanceof(ICalEvent);

  // TestSchema.parse(events);

  console.log(req.body);

  const filename = "calendar.ics";

  try {
    const calendar = icalendar({
      timezone: "GMT+8",
      description: "",
      prodId: "//shuddy.one//duty_generator//TC",
      // events: events,
    });

    // return res.status(200).send(calendar.toString())

    return new Response(calendar.toBlob(), {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename='${filename}'`,
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify(err), { status: 500 });
  }
}
