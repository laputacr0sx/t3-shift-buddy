import React, { type ReactElement } from "react";
import DynamicExchangeForm from "~/components/dynamicExchangeForm";
import { type NextPageWithLayout } from "./_app";
import Layout from "~/components/ui/layouts/AppLayout";

const Feature: NextPageWithLayout = () => {
  return (
    <div>
      <h1 className="justify-center py-5 text-center text-4xl font-semibold text-foreground">
        調更易
      </h1>
      <DynamicExchangeForm />
    </div>
  );
};

Feature.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Feature;
