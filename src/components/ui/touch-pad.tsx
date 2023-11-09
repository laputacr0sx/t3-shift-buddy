import React from "react";
import { Button } from "./button";
import { type UseFormReturn } from "react-hook-form";

type TouchPadProps = {
  rowForm: UseFormReturn<{
    shiftRow: string;
  }>;
};

function TouchPad(props: TouchPadProps) {
  const { rowForm } = props;
  const dayOffs = ["RD", "AL", "GH", "SH", "CL"];

  return (
    <>
      <fieldset className="flex gap-1 font-sans text-lg text-red-500">
        {dayOffs.map((each) => (
          <Button
            key={each}
            variant={"default"}
            onClick={() => {
              const originInput = rowForm.getValues("shiftRow");
              rowForm.setValue("shiftRow", originInput.concat(each));
            }}
          >
            {each}
          </Button>
        ))}
      </fieldset>
    </>
  );
}

export default TouchPad;
