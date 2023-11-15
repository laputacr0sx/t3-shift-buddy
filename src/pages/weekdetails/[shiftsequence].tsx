import React, { ReactElement } from "react";
import { type ParsedUrlQuery, encode } from "querystring";
import { NextPageWithLayout } from "../_app";
import Layout from "~/components/ui/layouts/AppLayout";
import { api } from "~/utils/api";

import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { getNextWeekDates } from "~/utils/helper";
import { urlShiftSequenceRegex } from "~/utils/regex";
import moment from "moment";

// export const getServerSideProps = ({
//   params,
// }: {
//   params: ParsedUrlQuery | undefined;
// }) => {
//   const parsedURLQueryParams = new URLSearchParams(encode(params));
//   const shiftSequence: unknown = parsedURLQueryParams.get("shiftsequence");

//   return { props: { shiftSequence } };
// };

function WeekDetails() {
  const router = useRouter();
  const { shiftsequence, weekNumber } = router.query;

  const validShiftSequence = shiftsequence
    ?.toString()
    .match(urlShiftSequenceRegex);

  const validWeekNumber = weekNumber?.toString() ?? "";

  const correspondingWeekDates = getNextWeekDates(validWeekNumber);

  const test = validShiftSequence?.forEach((shift) => {
    const shortDay = shift.match(/[a-z]{2}/gim)?.[0] as string;

    const position = correspondingWeekDates
      .map((date) => moment(date).locale("en").format("dd"))
      .indexOf(shortDay);

    console.log(position);
    return;
  });

  // const validShiftArray = correspondingWeekDates.reduce<string[]>(
  //   (result, date, i) => {
  //     const shortWeekDay = moment(date).locale("en").format("dd");
  //     const shift = validShiftSequence?.[i];
  //     const shiftWeekDay = shift?.match(/[a-z]{2}/gim)?.[0];

  //     console.log(shiftWeekDay, shortWeekDay);

  //     if (shiftWeekDay === shortWeekDay) {
  //       const shiftCode = shift?.match(/\d+|AL|RD|CL|GH|SH/gim)?.[0] as string;
  //       result.push(shiftCode);
  //     }

  //     return result;
  //   },
  //   []
  // );

  console.log(test);

  // const {
  //   data: weeekShifts,
  //   isLoading: loadingWeekShifts,
  //   error: weekShiftsError,
  // } = api.shiftController.getWeekShiftWithPrefix.useQuery({
  //   shiftArray: [],
  // });

  // if (weekShiftsError) return <>{weekShiftsError.message}</>;

  return (
    <div className="">
      <section className="absolute left-0 top-0">
        <Button
          onClick={() => {
            router.back();
          }}
        >
          Back
        </Button>
      </section>
      <section className="justify-center self-center">{shiftsequence}</section>
    </div>
  );
}

WeekDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default WeekDetails;
