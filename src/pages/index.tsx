import React, { type ReactElement } from "react";
import { type NextPageWithLayout } from "./_app";
import Layout from "~/components/ui/layouts/AppLayout";

import { api } from "~/utils/api";
import { slicedKLN } from "~/utils/standardRosters";

const LandingPage: NextPageWithLayout = () => {
  const {
    data: timetableData,
    isLoading: timetableLoading,
    error: timetableError,
  } = api.timetableController.getAllTimetables.useQuery();

  console.log(slicedKLN);

  return (
    <div>
      {timetableLoading ? (
        <>Loading...</>
      ) : timetableError ? (
        <p>{timetableError.message}</p>
      ) : (
        timetableData.map((timetable) => (
          <p key={timetable.toc}>
            {timetable.prefix} {timetable.dateOfEffective.toDateString()}
          </p>
        ))
      )}
    </div>
  );
};

LandingPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default LandingPage;
