import React from "react";
import { api, RouterOutputs } from "~/utils/api";

export default function index() {
  const { mutate: updatePrefixes } =
    api.updateShifts.createNextWeekPrefix.useMutation({
      onError(error) {
        console.log(error.message);
      },
    });

  type Prefix = RouterOutputs["updateShifts"]["createNextWeekPrefix"];

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
    </div>
  );
}
