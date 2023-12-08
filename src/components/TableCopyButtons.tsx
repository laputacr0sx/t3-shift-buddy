import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getSelectedShiftsString, tableCopyHandler } from "~/utils/helper";
import { type DayDetail } from "~/utils/customTypes";
import { type Row } from "@tanstack/react-table";

type TableCopyButtonsProps = {
  isSomeRowSelected: boolean;
  selectedShifts: Row<DayDetail>[];
};

function TableCopyButtons({ selectedShifts }: TableCopyButtonsProps) {
  const completeShiftsString = getSelectedShiftsString(selectedShifts);

  console.log(completeShiftsString);

  const encodedShiftsStringURI = encodeURIComponent(completeShiftsString);

  const numberOfSelectedShifts = selectedShifts.length;

  return (
    <>
      <div className="flex items-center justify-around gap-4">
        <Button
          className="my-2 self-center align-middle font-light"
          variant={"secondary"}
          disabled={!numberOfSelectedShifts}
          onClick={() => tableCopyHandler(selectedShifts)}
        >
          {!!numberOfSelectedShifts ? (
            <p className="tracking-widest">
              <span>複製</span>
              <span className="font-mono font-extrabold">
                {`${numberOfSelectedShifts}`}
              </span>
              <span>更資料</span>
            </p>
          ) : (
            "未選取任何更份"
          )}
        </Button>
      </div>
      <Link
        href={`whatsapp://send?text=${encodedShiftsStringURI}`}
        className="flex flex-row self-center align-middle text-emerald-700 dark:text-emerald-300"
      >
        <MessageCircle className="m-2 h-4 w-4 self-center" />
        <p className={"self-center text-center text-xs "}>開啟WhatsApp</p>
      </Link>
    </>
  );
}

export default TableCopyButtons;
