import React, { useEffect, type ReactElement } from "react";

import ExchangeForm from "~/components/ExchangeForm";
import Layout from "~/components/ui/layouts/AppLayout";

function Exchange() {
  return (
    <div className="py-2">
      <ExchangeForm />
    </div>
  );
}

Exchange.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Exchange;
