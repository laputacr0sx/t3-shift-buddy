import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";
// import ShiftCard from "../../../components/ShiftCard";
// import { Skeleton } from "~/components/ui/skeleton";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { sevenShiftRegex } from "~/lib/regex";
import moment from "moment";
import { combinePrefix } from "~/lib/utils";

function Index() {
  const router = useRouter();
  const shiftsequence = router.query.shiftsequence as string;

  const shifts = shiftsequence?.match(sevenShiftRegex);

  const { data: currentPrefix } =
    api.prefixController.getCurrentPrefix.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  // const {
  //   data: shiftData,
  //   isLoading: loadingShiftData,
  //   error: errorShiftData,
  // } = api.getShifts.findShift.useQuery(
  //   {
  //     duty: shiftsequence,
  //   },
  //   { enabled: !!router.query.shiftsequence, refetchOnWindowFocus: false }
  // );

  return (
    <>
      <div className="flex flex-row items-center justify-between self-center px-5 pt-4 font-mono font-extrabold">
        <div className="flex flex-col text-left">
          <h1 className="py-2 text-xl">以下為下週更資料</h1>
          <p className="text-sm text-muted-foreground">點擊資料以複製</p>
        </div>
        <div>
          <Link
            href={""}
            className={"pointer-events-none flex flex-row text-red-300"}
          >
            <MessageCircle className="m-2 h-4 w-4" />
            <p className={"self-center text-center  text-sm "}>九龍更群組</p>
          </Link>
          <Link
            href={""}
            className={"pointer-events-none flex flex-row text-blue-300"}
          >
            <MessageCircle className="m-2 h-4 w-4" />
            <p className={"self-center text-center  text-sm "}>上水更群組</p>
          </Link>
        </div>
      </div>
      <p className={"text-center align-middle"}>
        {moment(currentPrefix && currentPrefix[0]?.updatedAt).fromNow()}
      </p>

      {/* {shiftData?.map((shiftDetail) => (
        <ShiftCard key={shiftDetail.id} shift={shiftDetail} />
      ))} */}
    </>
  );
}

export default Index;
