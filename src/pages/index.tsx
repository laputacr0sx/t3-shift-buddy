import React, { useEffect, type ReactElement } from "react";
import Layout from "~/components/ui/layouts/AppLayout";
import { type NextPageWithLayout } from "./_app";
import SevenSlotsSearchForm from "~/components/SevenSlotsSearchForm";
import toast from "react-hot-toast";

const SevenSlots: NextPageWithLayout = () => {
  useEffect(() => {
    toast.error("Y2024W1 時間表錯配，請各用家留意。");

    return () => {
      toast.remove();
    };
  }, []);

  return (
    <React.Fragment>
      <h1
        id="title"
        className="justify-center py-5 text-center text-4xl font-semibold text-foreground"
      >
        出更易
      </h1>
      <p className=" text-destructive">Y2024W1 時間表錯配，請各用家留意。</p>
      <SevenSlotsSearchForm />
    </React.Fragment>
  );
};

SevenSlots.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SevenSlots;
