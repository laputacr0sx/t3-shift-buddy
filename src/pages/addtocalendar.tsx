import React, { type ReactElement } from "react";
import type { NextPageWithLayout } from "./_app";

import { atcb_action } from "add-to-calendar-button";
import { Button } from "~/components/ui/button";
import Layout from "~/components/ui/layouts/AppLayout";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

const Page: NextPageWithLayout = () => {
  const {
    data: blobData,
    isLoading: blobLoading,
    error: blobError,
    refetch: fetchBlob,
  } = api.calendarController.getCurrentEvents.useQuery(
    [
      {
        bFL: "HUH",
        bNL: "HUH",
        bNT: "07:00",
        bFT: "15:00",
        date: "2023-12-23",
        duration: "7:30",
        dutyNumber: "T15101",
        id: "6d22089d-391f-49c7-ad13-cf833621b259",
        title: "T15101",
        remarks: "EMU",
        staffId: "",
      },
    ],
    {
      enabled: false,
    }
  );

  if (blobError) {
    toast.error(blobError.message);
  }

  function handleClick() {
    console.log(new Date().toISOString().split("T")[0]);
    if (!blobLoading && blobData) {
      atcb_action({
        subscribe: true,
        icsFile: blobData.url,
        name: "dutyNumber",
        options: ["Apple", "Google", "Microsoft365", "iCal"],
        location: "Hong Kong",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        description: "testing",
        timeZone: "Asia/Hong_Kong",
      });
      console.log("added to calendar");
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Button
        variant={"outline"}
        onClick={async () => {
          return fetchBlob();
        }}
      >
        getNewEvents!
      </Button>
      {!blobLoading ? (
        <Button
          variant={"outline"}
          size={"lg"}
          className=""
          onClick={() => {
            return handleClick();
          }}
        >
          Add!
        </Button>
      ) : null}
    </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
