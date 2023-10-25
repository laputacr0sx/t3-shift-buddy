import SearchShiftForm from "~/components/SearchShiftForm";
import { type NextPageWithLayout } from "./_app";
import { type ReactElement } from "react";
import Layout from "~/components/ui/layouts/AppLayout";

const Home: NextPageWithLayout = () => (
  <div className="h-full md:max-w-screen-2xl ">
    <h1 className="justify-center py-5 text-center text-4xl font-semibold text-foreground">
      查更易
    </h1>
    <SearchShiftForm />
  </div>
);

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
