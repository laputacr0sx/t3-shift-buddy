import type { Shifts } from "@prisma/client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { toast } from "./ui/useToast";
import { convertDuration } from "~/utils/helper";

import { AddToCalendarButton } from "add-to-calendar-button-react";

interface WeekComplex {
  date: Date | undefined;
  title: string | undefined;
  dutyObject: Shifts | undefined;
}

export default function ResponsiveShiftCard(props: WeekComplex) {
  if (!props.date || !props.dutyObject || !props.title)
    return <p>Error Occurred...</p>;

  const { dutyNumber, bNL, bNT, bFL, bFT, duration, remarks } =
    props.dutyObject;
  const durationDecimal = convertDuration(duration);

  return (
    <div className="flex justify-evenly gap-1">
      <AddToCalendarButton
        name={dutyNumber}
        startDate={props.date.toISOString()}
        options={["Apple", "Google", "iCal"]}
        startTime={bNT}
        endTime={bFT}
        timeZone="Asia/Chongqing"
        location={bFL}
        buttonStyle="date"
        size="5"
        description={`${remarks}`}
        lightMode="bodyScheme"
      ></AddToCalendarButton>
      <Card className=" mx-5 my-6 w-screen font-mono  md:max-w-xl">
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
      </Card>
    </div>
  );
}
