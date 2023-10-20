import React, { useState, type ReactElement } from "react";
import moment from "moment";
import { z } from "zod";
import { type ParsedUrlQuery, encode } from "querystring";
import { columns } from "~/components/ShiftTable/Shifts-column";
import { DataTable } from "~/components/ShiftTable/Shifts-data-table";
import { api } from "~/utils/api";
import { getNextWeekDates } from "~/utils/helper";
import { dutyInputRegExValidator, sevenShiftRegex } from "~/utils/regex";
import Layout from "~/components/ui/layouts/AppLayout";
import { workLocation } from "~/utils/customTypes";
import { Button } from "~/components/ui/button";
import { Minus, Plus, RotateCcw } from "lucide-react";

export const dayDetailSchema = z.object({
  date: z.string().datetime(),
  title: z.string(),
  id: z.string().uuid(),
  dutyNumber: z.string().regex(dutyInputRegExValidator),
  bNL: z.enum(workLocation),
  bNT: z.string(),
  bFT: z.string(),
  bFL: z.enum(workLocation),
  duration: z.string(),
  remarks: z.string(),
});

export type DayDetail = z.infer<typeof dayDetailSchema>;

function WholeWeek({ legitRawShiftArray }: RawShiftArray) {
  const [userWeekNumberInput, setUserWeekNumberInput] = useState(
    moment().week() + 1
  );

  moment.updateLocale("zh-hk", {
    weekdaysShort: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
    weekdaysMin: ["日", "一", "二", "三", "四", "五", "六"],
  });

  const {
    data: shiftDetails,
    isLoading: shiftsArrayLoading,
    error: shiftsArrayError,
  } = api.shiftController.getWeekShiftWithPrefix.useQuery({
    shiftArray: legitRawShiftArray,
  });

  if (shiftsArrayLoading) return <>Loading Shifts...</>;
  if (shiftsArrayError) return <>Shifts Error </>;

  const nextWeekDates = getNextWeekDates(userWeekNumberInput);

  const combinedDetail = new Array<DayDetail>(7);
  for (let i = 0; i < shiftDetails.combinedDutyName.length; i++) {
    const [shift] = shiftDetails.resultShiftArray.filter(
      (shift) => shift.dutyNumber === shiftDetails.combinedDutyName[i]
    );
    combinedDetail[i] = {
      date: nextWeekDates[i]?.toISOString(),
      title: shiftDetails.combinedDutyName[i],
      dutyNumber: shift?.dutyNumber || shiftDetails.combinedDutyName[i],
      ...shift,
    } as DayDetail;
  }

  return (
    <React.Fragment>
      <div className="flex items-center justify-center pt-2 font-mono font-extrabold">
        週數
        <Button
          onClick={() => {
            setUserWeekNumberInput(() => {
              return userWeekNumberInput + 1;
            });
          }}
        >
          <Plus size={20} />
        </Button>
        {userWeekNumberInput}
        <Button
          onClick={() => {
            setUserWeekNumberInput(() => {
              return userWeekNumberInput - 1;
            });
          }}
        >
          <Minus size={20} />
        </Button>
        <Button
          onClick={() => {
            setUserWeekNumberInput(() => {
              return moment().week() + 1;
            });
          }}
        >
          <RotateCcw size={20} />
        </Button>
      </div>
      <div className="flex h-full w-screen flex-col gap-2 py-2">
        {shiftDetails ? (
          <DataTable columns={columns} data={combinedDetail} />
        ) : null}
      </div>
    </React.Fragment>
  );
}

export const shiftSequenceSchema = z.string();

export const rawShiftArraySchema = z.array(z.string().regex(sevenShiftRegex));

export type RawShiftArray = {
  legitRawShiftArray: z.infer<typeof rawShiftArraySchema>;
};

export const getServerSideProps = ({
  params,
}: {
  params: ParsedUrlQuery | undefined;
}) => {
  const parsedURLQueryParams = new URLSearchParams(encode(params));
  const shiftSequence: unknown = parsedURLQueryParams.get("shiftsequence");
  const validatedShiftSequence = shiftSequenceSchema.safeParse(shiftSequence);

  if (!validatedShiftSequence.success) {
    console.error(validatedShiftSequence.error);
    return { props: { legitRawShiftArray: [""] } };
  }

  const rawShiftArray: unknown =
    validatedShiftSequence.data.match(sevenShiftRegex);
  const validatedRawShiftArray = rawShiftArraySchema.safeParse(rawShiftArray);

  if (!validatedRawShiftArray.success) {
    console.error(validatedRawShiftArray.error);
    return { props: { legitRawShiftArray: [""] } };
  }

  const legitRawShiftArray = validatedRawShiftArray.data;

  return { props: { legitRawShiftArray } };
};

WholeWeek.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default WholeWeek;
