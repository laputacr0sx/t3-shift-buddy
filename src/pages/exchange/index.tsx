import React, { type ReactElement } from "react";
import { Input } from "~/components/ui/input";
import Layout from "~/components/ui/layouts/AppLayout";

function Exchange() {
  return (
    <div>
      <form action="">
        <Input type="text" />
        <Input type="button" value="button" />
      </form>
    </div>
  );
}

Exchange.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Exchange;
