import {
  type GetStaticPaths,
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";
import React from "react";
import { api } from "~/utils/api";

type shiftsArray = {
  weekrow: string[];
};

// function WholeWeek({
//   rawShiftsArray,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) {
function WeekRow({}) {
  const {
    data,
    isLoading: completeIsLoading,
    error: completeError,
  } = api.shiftController.getWeekShiftWithPrefix.useQuery(
    {
      shiftArray: ["101", "102", "103", "104", "105", "106", "RD"],
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  if (completeIsLoading) return <p>Loading Detail</p>;

  if (completeError) return <h1>{completeError.message}</h1>;

  return <div>{data}</div>;
}

export default WeekRow;

// export const getServerSideProps = (({ query }) => {
//   // return { notFound: true };

//   return {
//     props: {
//       hello: "Hello Felix",
//     },
//   };
// }) satisfies GetServerSideProps;
