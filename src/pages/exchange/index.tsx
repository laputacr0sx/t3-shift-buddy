import React, { type ReactElement } from "react";
import ExchangeForm from "~/components/ExchangeForm";

import Layout from "~/components/ui/layouts/AppLayout";

function Exchange() {
  return <ExchangeForm />;
}

Exchange.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Exchange;
