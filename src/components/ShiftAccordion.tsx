import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { type Shift } from "@prisma/client";
import { convertDurationDecimal } from "~/utils/helper";
import { toast } from "./ui/useToast";

type ShiftAccordionProps = {
  shift: Shift;
};

function ShiftAccordion({ shift }: ShiftAccordionProps) {
  const { bFL, bFT, bNL, bNT, dutyNumber, remarks } = shift;

  const handleOnClickCopyEvent = async () => {
    const { bFL, bNL, duration, dutyNumber, remarks, bNT, bFT } = shift;
    const durationDecimal = convertDurationDecimal(duration);

    if (!navigator || !navigator.clipboard)
      throw Error("No navigator object nor clipboard found");

    await navigator.clipboard.writeText(
      `\`\`\`${dutyNumber} ${durationDecimal}\n[${bNL}]${bNT}-${bFT}[${bFL}]\n<${remarks}>\`\`\``
    );

    toast({
      title: `已複製 ${dutyNumber} 更資料`,
      description: `\`\`\`${dutyNumber} ${durationDecimal}\n[${bNL}]${bNT}-${bFT}[${bFL}]\n<${remarks}>\`\`\``,
    });
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="">{dutyNumber}</AccordionTrigger>
        <AccordionContent
          onClick={handleOnClickCopyEvent}
          className="hover:font-bold"
        >{`[${bNL}]${bNT}-${bFT}[${bFL}]\n<${remarks}>`}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default ShiftAccordion;
