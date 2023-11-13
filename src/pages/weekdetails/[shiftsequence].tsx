import React, { ReactElement } from "react";
import { type ParsedUrlQuery, encode } from "querystring";
import { NextPageWithLayout } from "../_app";
import Layout from "~/components/ui/layouts/AppLayout";

export const getServerSideProps = ({
  params,
}: {
  params: ParsedUrlQuery | undefined;
}) => {
  const parsedURLQueryParams = new URLSearchParams(encode(params));
  const shiftSequence: unknown = parsedURLQueryParams.get("shiftsequence");

  console.log({ shiftSequence });

  return { props: { shiftSequence } };
};

function WeekDetails({ shiftSequence }: { shiftSequence: string }) {
  return <div>{shiftSequence}</div>;
}

WeekDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default WeekDetails;
