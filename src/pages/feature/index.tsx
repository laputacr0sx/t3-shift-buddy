import React from "react";
import { api } from "~/utils/api";

export default function index() {
  const { mutate, error, isLoading, isSuccess } =
    api.updateShifts.createNextWeekPrefix.useMutation();

  if (isSuccess) console.log("done!");

  return (
    <div className="flex justify-center align-middle">
      <button
        className={"rounded-sm border-2 border-red-800"}
        onClick={() => {
          mutate({
            prefixes: ["D15", "D15", "B14", "D15", "D15", "A75", "Z71"],
          });
        }}
      >
        Click me!
      </button>
    </div>
  );
}
