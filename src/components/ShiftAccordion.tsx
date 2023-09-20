import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Shifts } from "@prisma/client";

type ShiftAccordionProps = {
  shift: Shifts;
};

function ShiftAccordion({ shift }: ShiftAccordionProps) {
  const { bFL, bFT, bNL, bNT, duration, dutyNumber, id, remarks } = shift;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="">{dutyNumber}</AccordionTrigger>
        <AccordionContent
          onClick={() => {
            console.log(`${dutyNumber} clicked`);
          }}
          className="hover:font-bold"
        >{`[${bNL}]${bNT}-${bFT}[${bFL}]\n<${remarks}>`}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default ShiftAccordion;
