import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import {
  convertDurationDecimal,
  getICSObject,
  getSelectedShiftsString,
  tableCopyHandler,
} from "~/utils/helper";
import { type DayDetail } from "~/utils/customTypes";
import { type Row } from "@tanstack/react-table";

import { type EventAttributes, type ReturnObject, createEvents } from "ics";
import moment from "moment";
import { PutBlobResult } from "@vercel/blob";

import { upload } from "@vercel/blob/client";
import { useUser } from "@clerk/nextjs";

type TableCopyButtonsProps = {
  isSomeRowSelected: boolean;
  selectedShifts: Row<DayDetail>[];
};

function TableCopyButtons({ selectedShifts }: TableCopyButtonsProps) {
  const user = useUser();
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  const completeShiftsString = getSelectedShiftsString(selectedShifts);
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
        {user.user?.fullName === "Felix Ng" ? (
          <Button
            className="my-2 self-center align-middle font-light"
            variant={"secondary"}
            disabled={!numberOfSelectedShifts}
            onClick={async (event) => {
              const file = await getICSObject(selectedShifts);
              event.preventDefault();

              console.log(file);

              const newBlob = await upload(file.name, file, {
                access: "public",
                handleUploadUrl: "/api/upload",
              });

              setBlob(newBlob);
            }}
          >
            {!!numberOfSelectedShifts ? (
              <p className="tracking-widest">
                <span>加入</span>
                <span className="font-mono font-extrabold">
                  {`${numberOfSelectedShifts}`}
                </span>
                <span>更資料</span>
              </p>
            ) : (
              "未選取任何更份"
            )}
          </Button>
        ) : null}
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
