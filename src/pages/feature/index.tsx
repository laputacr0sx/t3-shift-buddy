import React from "react";
import { api } from "~/utils/api";

export default function index() {
  const { mutate: updatePrefixes } =
    api.prefixController.createNextWeekPrefix.useMutation({
      onError(error) {
        console.log(error.message);
      },
    });

  const { data: currentPrefixList } =
    api.prefixController.getCurrentPrefix.useQuery();

  return (
    <div className="flex w-screen flex-col items-center justify-center">
      <button
        className={"border-2 border-red-800 text-blue-700"}
        onClick={() => {
          updatePrefixes({
            prefixes: ["D15", "D15", "B14", "D15", "D15", "A75", "Z71"],
          });
        }}
      >
        Click me!
      </button>
      <p>{JSON.stringify(currentPrefixList)}</p>
    </div>
  );
}
