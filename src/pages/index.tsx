import React, { type ReactElement } from "react";
import Layout from "~/components/ui/layouts/AppLayout";
import { type NextPageWithLayout } from "./_app";
import SevenSlotsSearchForm from "~/components/SevenSlotsSearchForm";
import { api } from "~/utils/api";

const SevenSlots: NextPageWithLayout = () => {
  const {
    data: authData,
    isLoading: authLoading,
    error: authError,
  } = api.shiftController.tryAuth.useQuery();

  return (
    <React.Fragment>
      {authLoading ? (
        <p>loading auth</p>
      ) : authError ? (
        <p>{authError.message}</p>
      ) : (
        <p>{authData}</p>
      )}
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
