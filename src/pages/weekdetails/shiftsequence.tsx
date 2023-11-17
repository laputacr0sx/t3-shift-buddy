import React, { ReactElement } from "react";
import Layout from "~/components/ui/layouts/AppLayout";

import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";

function WeekDetails() {
  const router = useRouter();
  const queryString = router.query;

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
      <section className="justify-center self-center">Hello</section>
    </div>
  );
}

WeekDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default WeekDetails;
