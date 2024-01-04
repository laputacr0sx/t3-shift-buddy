import * as React from "react";

import ChineseCalendars from "./ChineseCalendar";
import ShiftAccordion from "./ShiftAccordion";

import type { Shift } from "@prisma/client";

interface WeekComplex {
  date: Date | undefined;
  title: string | undefined;
  dutyObject: Shift | undefined;
}

export default function ShiftArrayCard(props: WeekComplex) {
  if (!props.date || !props.dutyObject || !props.title)
    return <p>Error Occurred...</p>;

  return (
    <div className="flex w-screen justify-start gap-1">
      <ShiftAccordion shift={props.dutyObject} key={props.dutyObject.id} />
      {/* <Card className="mx-5 my-6 w-screen bg-card font-mono md:max-w-xl">
        <CardHeader
          className="rounded-t-lg hover:bg-blue-900 active:bg-blue-950"
          onClick={async () => {
            await navigator.clipboard.writeText(
              `\`\`\`${dutyNumber} ${durationDecimal}\n[${bNL}]${bNT}-${bFT}[${bFL}]<${remarks}>\`\`\``
            );
            toast({
              title: `已複製 ${dutyNumber} 更資料`,
              description: `\`\`\`${dutyNumber} ${durationDecimal}\n[${bNL}]${bNT}-${bFT}[${bFL}]<${remarks}>\`\`\``,
            });
          }}
        >
          <CardTitle>{dutyNumber}</CardTitle>
          <CardDescription>{remarks}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            返{bNT} [{bNL}]
          </p>
          <p>
            收{bFT} [{bFL}]
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <h6>{durationDecimal}</h6>
        </CardFooter>
      </Card> */}
    </div>
  );
}
