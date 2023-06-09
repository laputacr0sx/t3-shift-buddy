import { Shifts } from "@prisma/client";
import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/component/ui/card";

interface PropType {
  shift: Shifts;
}

export default function ShiftCard(props: PropType) {
  return (
    <Card className="m-2 w-auto">
      <CardHeader>
        <CardTitle>{props.shift?.dutyNumber}</CardTitle>
        <CardDescription>{props.shift?.remarks}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          返{props.shift?.bNT} [{props.shift?.bNL}]
        </p>
        <p>
          收{props.shift?.bFT} [{props.shift?.bFL}]
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <h6>{props.shift?.duration}</h6>
      </CardFooter>
    </Card>
  );
}
