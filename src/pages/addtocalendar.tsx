import { atcb_action } from "add-to-calendar-button";
import React, { type ReactElement } from "react";
import { Button } from "~/components/ui/button";
import type { NextPageWithLayout } from "./_app";
import Layout from "~/components/ui/layouts/AppLayout";
import { api } from "~/utils/api";
import TableLoading from "~/components/TableLoading";

const Page: NextPageWithLayout = () => {
  const {
    data: blobData,
    isLoading: blobLoading,
    error: blobError,
    refetch: fetchBlob,
    isFetching: isFetchingBlob,
  } = api.calendarController.getCurrentEvents.useQuery([], {
    enabled: false,
  });

  if (blobError) throw new Error(blobError.message);

  function handleClick() {
    console.log(new Date().toISOString().split("T")[0]);
    if (!blobLoading && blobData)
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
      {isFetchingBlob ? <TableLoading /> : null}
    </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
