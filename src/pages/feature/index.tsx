import React from "react";
import { api, type RouterOutputs } from "~/utils/api";

export default function index() {
  const { mutate: updatePrefixes } =
    api.prefixController.createNextWeekPrefix.useMutation({
      onError(error) {
        console.log(error.message);
      },
    });

  const { data: currentPrefixList } =
    api.prefixController.getCurrentPrefix.useQuery();

  type Prefix = RouterOutputs["prefixController"]["createNextWeekPrefix"];

  return (
    <div className="flex items-center justify-center">
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
      <div>{JSON.stringify(currentPrefixList)}</div>
    </div>
  );
}
