import React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/utils/api";
import { getNextWeekDates } from "~/lib/utils";

export default function index() {
  const { mutate: updatePrefixes } =
    api.prefixController.createNextWeekPrefix.useMutation();

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

  if (Array.isArray(currentPrefixList) && !currentPrefixList?.length) {
    return (
      <h1 className={"h-screen text-center font-bold"}>
        Missing duty data ...
      </h1>
    );
  }

  return (
    <div className="flex w-screen flex-col items-center justify-center">
      <button
        className={"border-2 border-red-800 text-blue-700"}
        onClick={() => {
          updatePrefixes({
            content: ["D15", "D15", "B14", "D15", "D15", "A75", "Z71"],
            weekNumber: 25,
          });
        }}
      >
        Click me!
      </button>
      {JSON.stringify(getNextWeekDates())}
      {currentPrefixList ? (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        currentPrefixList[0]?.content?.map((prefix) => <></>)
      ) : (
        <></>
      )}
    </div>
  );
}
