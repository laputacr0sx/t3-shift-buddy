import { type Shifts } from "@prisma/client";
import React from "react";
import { DataTable } from "./Shifts-data-table";
import { columns } from "./Shifts-column";

interface WeekComplex {
  date: Date;
  title: string;
  dutyObject: Shifts;
}

function ShiftsTable(props: WeekComplex) {
  if (!props.date || !props.dutyObject || !props.title)
    return <p>Error Occurred...</p>;

  const { dutyNumber } = props.dutyObject;

  const shiftsArray = props;

  return <>Hello</>;

  // return (
  //   <div className="container mx-auto py-10">
  //     <DataTable columns={columns} data={props.dutyObject} />
  //   </div>
}

export default ShiftsTable;
