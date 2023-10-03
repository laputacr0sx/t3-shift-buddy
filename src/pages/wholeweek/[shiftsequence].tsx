import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { Shifts } from "@prisma/client";
import { useRouter } from "next/router";

import React from "react";
import { columns } from "~/components/ShiftTable/Shifts-column";
import { DataTable } from "~/components/ShiftTable/Shifts-data-table";
import { api } from "~/utils/api";
import { getNextWeekDates } from "~/utils/helper";
import { sevenShiftRegex, threeDigitShiftRegex } from "~/utils/regex";
import { encode } from "querystring";

function WholeWeek({
  rawShiftsArray,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // function WholeWeek() {
  // const router = useRouter();
  // const shiftsequence = router?.query?.shiftsequence as string;

  // const rawShiftsArray = shiftsequence?.match(sevenShiftRegex);

  const {
    data: currentPrefix,
    isLoading: prefixLoading,
    error: prefixError,
  } = api.prefixController.getCurrentPrefix.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const currentPrefixesArray = currentPrefix?.[0]?.prefixes;

  const compleShiftNameArray = currentPrefixesArray?.map(
    (prefix, index): string => {
      return !threeDigitShiftRegex.test(rawShiftsArray?.[index] as string)
        ? (rawShiftsArray?.[index] as string)
        : prefix.concat(rawShiftsArray?.[index] as string);
    }
  );

  const {
    data: shiftsArray,
    isLoading: shiftsArrayLoading,
    error: shiftsArrayError,
  } = api.shiftController.getWeekShift.useQuery(
    {
      shiftArray: compleShiftNameArray!,
    },
    {
      enabled: compleShiftNameArray && compleShiftNameArray.length > 0,
      refetchOnWindowFocus: false,
    }
  );

  const nextWeekDates = getNextWeekDates();

  type CombinedDetail = {
    id: string;
    date: string;
    title: string;
    dutyNumber: string;
    bNL: string;
    bNT: string;
    bFT: string;
    bFL: string;
    duration: string;
    remarks: string;
  };

  function getWeekCombinedDetail(
    nextWeekDates: Date[],
    shiftArray: Shifts[],
    titles: string[]
  ) {
    if (!nextWeekDates || !shiftArray || !titles)
      throw new Error("incorrect data");

    let combinedDetail: CombinedDetail[] = [];

    if (shiftArray && nextWeekDates && titles) {
      for (let i = 0; i < 7; i++) {
        combinedDetail = [
          ...combinedDetail,
          { ...shiftArray[i], date: nextWeekDates[i], title: titles[i] },
        ];
      }
      return combinedDetail;
    }
  }

  // console.log({ nextWeekDates });
  // console.log({ rawShiftsArray });
  // console.log({ shiftsArray });

  if (shiftsArrayLoading || prefixLoading) return <>Loading Shifts...</>;

  if (shiftsArrayError || prefixError) return <>Shifts Error </>;

  const combinedDetail = getWeekCombinedDetail(
    nextWeekDates,
    shiftsArray,
    compleShiftNameArray
  );

  console.log(combinedDetail);
  return <>Hello</>;

  // return <>{JSON.stringify(combinedDetail)}</>;
  // <DataTable columns={columns} data={} />;
}

export const getServerSideProps = (({ params }) => {
  const parsedURLQueryParams = new URLSearchParams(encode(params));
  const sequence = parsedURLQueryParams.get("shiftsequence");
  const rawShiftsArray = sequence?.match(sevenShiftRegex);

  console.log(rawShiftsArray);

  return { props: { rawShiftsArray } };
}) satisfies GetServerSideProps<{ rawShiftsArray: string[] }>;

export default WholeWeek;
