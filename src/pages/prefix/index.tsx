import React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/utils/api";

import PrefixForm from "~/components/PrefixForm";
import { getNextWeekDates } from "~/utils/helper";

export default function index() {
  const { mutate: updatePrefixes } =
    api.prefixController.createNextWeekPrefix.useMutation({});

  const { data: currentPrefixList, isLoading: prefixLoading } =
    api.prefixController.getCurrentPrefix.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  if (prefixLoading)
    return (
      <>
        <div>
          <Skeleton className={"h-3 w-10 rounded-md"} />
        </div>
      </>
    );

  // if (Array.isArray(currentPrefixList) && !currentPrefixList?.length) {
  //   return (
  //     <h1 className={"h-screen text-center font-bold"}>
  //       Missing duty data ...
  //     </h1>
  //   );
  // }

  return (
    <div className="flex h-full w-screen flex-col items-center justify-center px-14 py-12">
      <h1 className="justify-center py-2 text-center font-mono text-4xl font-semibold text-foreground">
        時間表
      </h1>
      {/* <button
        className={"border-2 border-red-800 text-blue-700"}
        onClick={() => {
          updatePrefixes({
            prefixes: ["D15", "D15", "B14", "D15", "D15", "A75", "U71"],
            weekNumber: 25,
          });
        }}
        disabled
      >
        Click me!
      </button> */}

      {/* {currentPrefixList ? (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        currentPrefixList[0]?.prefixes?.map((prefix) => (
          <h1 key={currentPrefixList[0]?.id.concat(prefix)}>{prefix}</h1>
        ))
      ) : (
        <></>
      )} */}
      <PrefixForm
        dates={getNextWeekDates()}
        prefixes={currentPrefixList?.[0]}
      />
    </div>
  );
}
