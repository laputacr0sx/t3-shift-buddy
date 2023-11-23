import React, { useState, type ReactElement } from "react";
import moment from "moment";
import { type ParsedUrlQuery, encode } from "querystring";
import { DayDetailColumn } from "~/components/ShiftTable/DayDetailColumn";
import { DayDetailTable } from "~/components/ShiftTable/DayDetailTable";
import { api } from "~/utils/api";
import { getNextWeekDates } from "~/utils/helper";
import { proShiftNameRegex } from "~/utils/regex";
import Layout from "~/components/ui/layouts/AppLayout";
import {
  type DayDetail,
  type RawShiftArray,
  rawShiftArraySchema,
  shiftSequenceSchema,
} from "~/utils/customTypes";
import TableLoading from "~/components/TableLoading";

function WholeWeek({ legitRawShiftArray }: RawShiftArray) {
  console.log(legitRawShiftArray);

  // function WholeWeek() {
  const [userWeekNumberInput, setUserWeekNumberInput] = useState(
    moment().week() + 1
  );

  const {
    data: shiftDetails,
    isLoading: shiftsArrayLoading,
    error: shiftsArrayError,
  } = api.shiftController.getWeekShiftWithPrefix.useQuery(
    {
      shiftArray: legitRawShiftArray,
    },
    { refetchOnWindowFocus: false }
  );

  if (shiftsArrayLoading) return <TableLoading />;

  if (shiftsArrayError) return <>{shiftsArrayError.message}</>;

  const nextWeekDates = getNextWeekDates(userWeekNumberInput.toString());

  const dayDetails = new Array<DayDetail>(7);
  for (let i = 0; i < shiftDetails.combinedDutyName.length; i++) {
    const [shift] = shiftDetails.resultShiftArray.filter(
      (shift) => shift.dutyNumber === shiftDetails.combinedDutyName[i]
    );
    dayDetails[i] = {
      date: nextWeekDates[i]?.toISOString(),
      title: shiftDetails.combinedDutyName[i],
      dutyNumber: shift?.dutyNumber || shiftDetails.combinedDutyName[i],
      ...shift,
    } as DayDetail;
  }

  return (
    // <div className="flex flex-col items-center justify-center">

    <>
      <h1 className="justify-center py-5 text-center text-4xl font-semibold text-foreground">
        出更易結果
      </h1>
      <div className="flex h-full w-screen flex-col gap-2 py-2">
        {shiftDetails ? (
          <DayDetailTable columns={DayDetailColumn} data={dayDetails} />
        ) : null}
      </div>
    </>

    // </div>
  );
}

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
    validatedShiftSequence.data.match(proShiftNameRegex);
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
