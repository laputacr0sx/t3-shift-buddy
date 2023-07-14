import React from "react";
import PrefixChangingForm from "../../components/PrefixChangingForm";
import { Skeleton } from "~/components/ui/skeleton";

import { api } from "~/utils/api";

import { getNextWeekDates } from "~/utils/helper";

export default function index() {
  const {
    data: currentPrefixList,
    isLoading: prefixLoading,
    error: prefixError,
  } = api.prefixController.getCurrentPrefix.useQuery();

  if (prefixLoading)
    return (
      <>
        <div>
          <Skeleton className={"h-3 w-10 rounded-md"} />
        </div>
      </>
    );

  if (prefixError) {
    return <>{prefixError.message}</>;
  }

  return (
    <div className="flex h-full w-screen flex-col items-center justify-center px-14 py-12">
      <h1 className="justify-center py-2 text-center font-mono text-4xl font-semibold text-foreground">
        {`第${currentPrefixList?.[0]?.weekNumber.toString() || ""}週時間表`}
      </h1>
      <PrefixChangingForm
        dates={getNextWeekDates()}
        prefixes={currentPrefixList?.[0]}
      />
    </div>
  );
}
