import React, { type ReactElement } from "react";
import Layout from "~/components/ui/layouts/AppLayout";
import { type NextPageWithLayout } from "./_app";
import SevenSlotsSearchForm from "~/components/SevenSlotsSearch";
import Image from "next/image";

const SevenSlots: NextPageWithLayout = () => {
  return (
    <div>
      <h1 className="justify-center py-5 text-center text-4xl font-semibold text-foreground">
        出更易
      </h1>
      <SevenSlotsSearchForm />
    </div>
  );
};

SevenSlots.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SevenSlots;
