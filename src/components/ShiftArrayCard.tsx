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
import { convertDuration } from "~/lib/utils";
import ChineseCalendar from "./ChineseCalendar";

interface WeekComplex {
  date: Date | undefined;
  title: string | undefined;
  dutyObject: Shifts | undefined;
}

export default function ShiftArrayCard(props: WeekComplex) {
  if (!props.date || !props.dutyObject || !props.title) return;

  const { dutyNumber, bNL, bNT, bFL, bFT, duration, remarks } =
    props.dutyObject;
  const durationDecimal = convertDuration(duration);

  return (
    <div className="flex justify-start">
      <ChineseCalendar date={props.date} />
      <Card
        className="mx-5 my-6 max-w-full font-mono active:bg-blue-950"
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
        <CardHeader>
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
          <h6>{duration}</h6>
        </CardFooter>
      </Card>
    </div>
  );
}
