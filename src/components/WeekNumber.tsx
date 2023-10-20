import React, { useState } from "react";
import { Button } from "./ui/button";
import { Plus, Minus, RotateCcw } from "lucide-react";
import moment from "moment";
import { getNextWeekDates } from "~/utils/helper";

type WeekNumberProps = {
  userWeekNumberInput: number;
  setUserWeekNumberInput: React.Dispatch<React.SetStateAction<number>>;
};

function WeekNumber({
  userWeekNumberInput,
  setUserWeekNumberInput,
}: WeekNumberProps) {
  return (
    <div className="flex items-center justify-center pt-2 font-mono font-extrabold">
      週數
      <Button
        onClick={() => {
          setUserWeekNumberInput(() => {
            return userWeekNumberInput - 1;
          });
        }}
      >
        <Minus size={20} />
      </Button>
      {userWeekNumberInput}
      <Button
        onClick={() => {
          setUserWeekNumberInput(() => {
            return userWeekNumberInput + 1;
          });
        }}
      >
        <Plus size={20} />
      </Button>
      <Button
        onClick={() => {
          setUserWeekNumberInput(() => {
            return moment().week() + 1;
          });
        }}
      >
        <RotateCcw size={20} />
      </Button>
    </div>
  );
}

export default WeekNumber;
