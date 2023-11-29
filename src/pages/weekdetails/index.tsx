import React, { type ReactElement } from "react";
import Layout from "~/components/ui/layouts/AppLayout";
import { type NextPageWithLayout } from "../_app";
import SevenSlotsSearchForm from "~/components/SevenSlotsSearchForm";

const SevenSlots: NextPageWithLayout = () => {
  return (
    <React.Fragment>
      <h1
        id="title"
        className="justify-center py-5 text-center text-4xl font-semibold text-foreground"
      >
        出更易
      </h1>
      <SevenSlotsSearchForm />
    </React.Fragment>
  );
};

SevenSlots.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SevenSlots;
