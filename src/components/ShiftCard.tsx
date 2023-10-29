import type { Shift } from "@prisma/client";

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
import { convertDurationDecimal } from "~/utils/helper";

interface PropType {
  shift: Shift;
}

export default function ShiftCard(props: PropType) {
  const { dutyNumber, bNL, bNT, bFL, bFT, duration, remarks } = props.shift;
  const durationDecimal = convertDurationDecimal(duration);

  const handleOnClickCopyEvent = async () => {
    if (!navigator || !navigator.clipboard)
      throw Error("No navigator object nor clipboard found");

    await navigator.clipboard.writeText(
      `\`\`\`${dutyNumber} ${durationDecimal}\n[${bNL}]${bNT}-${bFT}[${bFL}]<${remarks}>\`\`\``
    );
    toast({
      title: `已複製 ${dutyNumber} 更資料`,
      description: `\`\`\`${dutyNumber} ${durationDecimal}\n[${bNL}]${bNT}-${bFT}[${bFL}]<${remarks}>\`\`\``,
    });
  };

  return (
    <Card
      className="mx-5 my-6 max-w-full font-mono active:bg-blue-950"
      onClick={handleOnClickCopyEvent}
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
  );
}
