import {
  type GetStaticPaths,
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";
import React from "react";
import { encode } from "querystring";

type shiftsArray = {
  weekrow: string[];
};

// function WholeWeek({
//   rawShiftsArray,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) {
function WeekRow({}) {
  return <div>WeekRow</div>;
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
