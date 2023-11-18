import React, { ReactElement } from "react";
import Layout from "~/components/ui/layouts/AppLayout";

import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { encode } from "querystring";

function WeekDetails() {
  const router = useRouter();
  const queryString = router.query;

  const searchParams = new URLSearchParams(encode(queryString));

  for (const [date, shift] of searchParams) {
    console.log(date, shift);
  }

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
      <section className="flex flex-col justify-center self-center">
        {encode(queryString)
          .split("&")
          .map((query, i) => (
            <p key={`${query}${i}`}>{query}</p>
          ))}
      </section>
    </div>
  );
}

WeekDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default WeekDetails;
