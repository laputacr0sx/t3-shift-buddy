import React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/utils/api";
import PrefixButton from "../../components/PrefixButton";
import { getNextWeekDates } from "~/lib/utils";

export default function index() {
  const { mutate: updatePrefixes } =
    api.prefixController.createNextWeekPrefix.useMutation();

  const { data: currentPrefixList, isLoading: prefixLoading } =
    api.prefixController.getCurrentPrefix.useQuery();

  if (prefixLoading)
    return (
      <>
        <div>
          <Skeleton className={"h-3 w-10 rounded-md"} />
        </div>
      </>
    );

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
      {/* {currentPrefixList?.prefixes.map((prefix) => {

      })} */}
    </div>
  );
}
