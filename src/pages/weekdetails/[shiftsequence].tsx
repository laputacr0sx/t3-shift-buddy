import React, { ReactElement } from "react";
import { type ParsedUrlQuery, encode } from "querystring";
import { NextPageWithLayout } from "../_app";
import Layout from "~/components/ui/layouts/AppLayout";
import { api } from "~/utils/api";

import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";

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
  // { shiftSequence }: { shiftSequence: string }
  const router = useRouter();
  console.log(router.query);

  const { shiftsequence } = router.query;

  // const {
  //   data: weeekShifts,
  //   isLoading: loadingWeekShifts,
  //   error: weekShiftsError,
  // } = api.shiftController.getWeekShiftWithPrefix.useQuery({
  //   shiftArray: [],
  // });

  // if (weekShiftsError) return <>{weekShiftsError.message}</>;

  return (
    <div>
      <section>
        <Button
          onClick={() => {
            router.back();
          }}
        >
          Back
        </Button>
      </section>
      {shiftsequence}
    </div>
  );
}

WeekDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default WeekDetails;
