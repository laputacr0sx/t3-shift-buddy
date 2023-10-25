import { Separator } from "~/components/ui/separator";
import SearchShiftForm from "~/components/SearchShiftForm";
import { type NextPageWithLayout } from "./_app";
import { type ReactElement } from "react";
import Layout from "~/components/ui/layouts/AppLayout";

const Home: NextPageWithLayout = () => (
  <div className="h-full w-screen px-14 py-12">
    <h1 className="justify-center py-2 text-center font-mono text-4xl font-semibold text-foreground">
      查更易
    </h1>
    <SearchShiftForm />
  </div>
);

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
