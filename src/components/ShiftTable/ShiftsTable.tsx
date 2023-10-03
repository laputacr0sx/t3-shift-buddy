import { type Shifts } from "@prisma/client";
import React from "react";

interface WeekComplex {
  date: Date;
  title: string;
  dutyObject: Shifts;
}

function ShiftsTable(props: WeekComplex) {
  if (!props.date || !props.dutyObject || !props.title)
    return <p>Error Occurred...</p>;

  return <div>{}</div>;
}

export default ShiftsTable;
