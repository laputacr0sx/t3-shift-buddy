import React, { type ReactElement } from "react";
import DynamicExchangeForm from "~/components/dynamicExchangeForm";
import { type NextPageWithLayout } from "./_app";
import Layout from "~/components/ui/layouts/AppLayout";

const Feature: NextPageWithLayout = () => {
  return <DynamicExchangeForm />;
};

Feature.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Feature;
