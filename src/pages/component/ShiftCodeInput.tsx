"use client";

import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button } from "~/component/ui/button";
import { Input } from "~/component/ui/input";

export default function ShiftCodeInput() {
  const router = useRouter();

  const [shiftCode, setShiftCode] = useState<string>("");

  return (
    <div className={"flex flex-row justify-start pt-6"}>
      <Input
        id="shiftCodeInput"
        type={"number"}
        className={"w-fit bg-blue-200 py-5"}
        value={shiftCode}
        onChange={(e) => setShiftCode(e.target.value)}
      />

      <Button
        type={"button"}
        variant="outline"
        size={"lg"}
        onClick={async () => {
          await router.push(`/${shiftCode}`);
        }}
      >
        查更
      </Button>
    </div>
  );
}