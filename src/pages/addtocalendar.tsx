import { atcb_action } from "add-to-calendar-button";
import React, { ReactElement } from "react";
import { Button } from "~/components/ui/button";
import { NextPageWithLayout } from "./_app";
import Layout from "~/components/ui/layouts/AppLayout";

const Page: NextPageWithLayout = () => {
  function handleClick() {
    console.log(new Date().toISOString().split("T")[0]);
    //
    atcb_action({
      name: "dutyNumber",
      options: ["Apple", "Google", "Microsoft365", "iCal"],
      location: "Hong Kong",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      description: "testing",
      timeZone: "Asia/Hong_Kong",
    });
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Button
        variant={"outline"}
        size={"lg"}
        className=""
        onClick={() => {
          handleClick();
        }}
      >
        Add!
      </Button>
    </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
