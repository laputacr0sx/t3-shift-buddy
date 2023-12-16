import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getSelectedShiftsString, tableCopyHandler } from "~/utils/helper";
import { type DayDetail } from "~/utils/customTypes";

import { useUser } from "@clerk/nextjs";

import { createClient } from "@supabase/supabase-js";
import { env } from "~/env.mjs";
import { atcb_action } from "add-to-calendar-button";

import { api } from "~/utils/api";

// Create Supabase client
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

type TableCopyButtonsProps = {
  isSomeRowSelected: boolean;
  selectedShifts: DayDetail[];
};

function TableCopyButtons({ selectedShifts }: TableCopyButtonsProps) {
  const user = useUser();

  const completeShiftsString = getSelectedShiftsString(selectedShifts);
  const encodedShiftsStringURI = encodeURIComponent(completeShiftsString);
  const numberOfSelectedShifts = selectedShifts.length;

  const {
    data: calendarData,
    isLoading: calendarLoading,
    error: calendarError,
  } = api.calendarController.transformToEvents.useQuery(selectedShifts, {
    refetchOnWindowFocus: false,
  });

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
        {user.isSignedIn && !calendarLoading && !calendarError ? (
          <>
            <Button
              className="my-2 self-center align-middle font-light"
              variant={"secondary"}
              disabled={calendarLoading && calendarData}
              onClick={(event) => {
                event.preventDefault();

                atcb_action({
                  subscribe: true,
                  startDate: "1992-07-04",
                  icsFile: calendarData.url,
                  name: "ICS file",
                  options: ["Apple", "Google", "Microsoft365", "iCal"],
                  timeZone: "currentBrowser",
                });
              }}
            >
              {calendarLoading ? "loading events..." : "subscribe!"}
            </Button>
          </>
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
