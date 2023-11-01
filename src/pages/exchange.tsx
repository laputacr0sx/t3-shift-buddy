import React, { type ReactElement } from "react";

import ExchangeForm from "~/components/ExchangeForm";
import Layout from "~/components/ui/layouts/AppLayout";

function Exchange() {
  return (
    <div>
      <h1 className="justify-center py-5 text-center text-4xl font-semibold text-foreground">
        調更易
      </h1>
      <ExchangeForm />
    </div>
  );
}

Exchange.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Exchange;
