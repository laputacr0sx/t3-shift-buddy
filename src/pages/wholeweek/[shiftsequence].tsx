import React from "react";
import {
  type ShiftTable,
  columns,
} from "~/components/ShiftTable/Shifts-column";
import { DataTable } from "~/components/ShiftTable/Shifts-data-table";
import { api } from "~/utils/api";
import { getNextWeekDates } from "~/utils/helper";
import { sevenShiftRegex } from "~/utils/regex";
import { type ParsedUrlQuery, encode } from "querystring";
import useShiftsArray from "~/hooks/useShiftsArray";
import * as z from "zod";
import { Button } from "~/components/ui/button";

function WholeWeek({ legitRawShiftArray }: RawShiftArray) {
  const compleShiftNameArray = useShiftsArray(legitRawShiftArray);

  const compleShiftNameArraySchema = z.array(z.string());

  const validatedCompleShiftNameArray =
    compleShiftNameArraySchema.safeParse(compleShiftNameArray);

  if (!validatedCompleShiftNameArray.success) {
    console.error(validatedCompleShiftNameArray.error);
    return;
  }

  const {
    data: shiftsArray,
    isLoading: shiftsArrayLoading,
    error: shiftsArrayError,
    refetch: shiftArrayRefetch,
  } = api.shiftController.getWeekShift.useQuery(
    {
      shiftArray: validatedCompleShiftNameArray.data,
    },
    {
      enabled: !validatedCompleShiftNameArray.success,
      refetchOnWindowFocus: false,
    }
  );

  if (shiftsArrayLoading)
    return (
      <>
        <Button onClick={() => shiftArrayRefetch()}>Fetch Array</Button>
        Loading Shifts...
      </>
    );

  if (shiftsArrayError) return <>Shifts Error </>;

  const nextWeekDates = getNextWeekDates();

  const combinedDetail = new Array<ShiftTable>(7);

  for (let i = 0; i < validatedCompleShiftNameArray.data.length; i++) {
    const exactShift = shiftsArray.filter(
      (shift) => shift.dutyNumber === validatedCompleShiftNameArray.data[i]
    );
    const [shift] = exactShift;

    combinedDetail[i] = {
      date: nextWeekDates[i]?.toISOString(),
      title: validatedCompleShiftNameArray.data[i],
      dutyNumber: shift?.dutyNumber || validatedCompleShiftNameArray.data[i],
      ...shift,
    } as ShiftTable;
  }

  return <DataTable columns={columns} data={combinedDetail} />;
}

const shiftSequenceSchema = z.string();

const rawShiftArraySchema = z.array(z.string().regex(sevenShiftRegex));

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

export default WholeWeek;
