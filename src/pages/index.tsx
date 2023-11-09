import SearchShiftForm from "~/components/SearchShiftForm";
import { type NextPageWithLayout } from "./_app";
import { type ReactElement } from "react";
import Layout from "~/components/ui/layouts/AppLayout";
import { autoPrefix } from "~/utils/helper";

autoPrefix();

const Home: NextPageWithLayout = () => (
  <div>
    <h1 className="justify-center py-5 text-center text-4xl font-semibold text-foreground">
      出更易
    </h1>
    <SearchShiftForm />
  </div>
);

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
