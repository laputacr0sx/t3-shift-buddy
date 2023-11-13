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
      <fieldset className="flex gap-1">
        {dayOffs.map((each) => (
          <Button
            type="button"
            key={each}
            variant={"default"}
            onClick={(e) => {
              e.preventDefault();
              const originInput = rowForm.getValues("shiftRow");
              rowForm.setValue("shiftRow", originInput.concat(each));
            }}
            className="border-b-2 font-mono tracking-wide"
          >
            {each}
          </Button>
        ))}
      </fieldset>
    </>
  );
}

export default TouchPad;
