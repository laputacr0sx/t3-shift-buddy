import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";
import ShiftCard from "../../../components/ShiftCard";
import { Skeleton } from "~/components/ui/skeleton";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

const whatsappURL = "https://chat.whatsapp.com/GjspanWzF2M8MysPayHpCX";

function Index() {
  const router = useRouter();
  const dutyNumber = router.query.dutyNumber as string;

  const {
    data: shiftData,
    isLoading: loadingShiftData,
    error: errorShiftData,
  } = api.getShifts.getShiftGivenDutyNumber.useQuery(
    {
      duty: dutyNumber,
    },
    { enabled: !!router.query.dutyNumber, refetchOnWindowFocus: false }
  );

  if (loadingShiftData) {
    return (
      <div className="flex h-screen items-center space-x-4 overflow-auto p-14">
        <Skeleton className="h-12 w-12 rounded-sm" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[160px]" />
        </div>
      </div>
    );
  }

  if (errorShiftData?.data?.code === "BAD_REQUEST") {
    return (
      <h1 className={"h-screen text-center font-bold"}>
        Bad Request, Please try again
      </h1>
    );
  }

  if (Array.isArray(shiftData) && !shiftData?.length) {
    return (
      <h1 className={"h-screen text-center font-bold"}>
        Missing duty data ...
      </h1>
    );
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between self-center px-5 pt-4 font-mono font-extrabold">
        <div className="flex flex-col text-left">
          <h1 className="py-2 text-xl">以下為 {dutyNumber} 更資料</h1>
          <p className="text-sm text-muted-foreground">點擊資料以複製</p>
        </div>
        <div>
          <Link
            href={whatsappURL}
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
      {shiftData?.map((shiftDetail) => (
        <ShiftCard key={shiftDetail.id} shift={shiftDetail} />
      ))}
    </>
  );
}

export default Index;
