import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { tableCopyHandler } from "~/utils/helper";
import { type DayDetail } from "~/utils/customTypes";
import { type Row } from "@tanstack/react-table";

type TableCopyButtonsProps = {
  isSomeRowSelected: boolean;
  selectedShifts: Row<DayDetail>[];
};

function TableCopyButtons({
  isSomeRowSelected,
  selectedShifts,
}: TableCopyButtonsProps) {
  return (
    <>
      <div className="flex items-center justify-around gap-4">
        <Button
          className="my-2 self-center align-middle font-light"
          variant={"outline"}
          // disabled={JSON.stringify(rowSelection) === "{}"}
          disabled={!isSomeRowSelected}
          onClick={() => tableCopyHandler(selectedShifts)}
        >
          複製
          <span className="font-extrabold">已選</span>
          資料
        </Button>
        <Button
          className="my-2 self-center align-middle font-light"
          // disabled={JSON.stringify(rowSelection) !== "{}"}
          disabled={isSomeRowSelected}
          variant={"outline"}
          onClick={() => tableCopyHandler(selectedShifts)}
        >
          複製
          <span className="font-extrabold">整週</span>
          資料
        </Button>
      </div>
      <Link
        href={`whatsapp://send?text=`}
        className="flex flex-row self-center align-middle text-emerald-700 dark:text-emerald-300"
      >
        <MessageCircle className="m-2 h-4 w-4 self-center" />
        <p className={"self-center text-center text-xs "}>開啟WhatsApp</p>
      </Link>
    </>
  );
}

export default TableCopyButtons;
