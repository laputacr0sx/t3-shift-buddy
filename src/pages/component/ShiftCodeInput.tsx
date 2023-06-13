"use client";

import React from "react";
import { Input } from "~/component/ui/input";

function shiftCodeSubmitHandler() {
  return;
}

export default function ShiftCodeInput() {
  return (
    <div>
      <Input
        className={"w-10 bg-blue-200 py-5"}
        onSubmit={shiftCodeSubmitHandler}
      />
    </div>
  );
}
