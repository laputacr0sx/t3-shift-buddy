import { type ReactElement } from "react";
import { type NextPageWithLayout } from "../_app";
import Layout from "~/components/ui/layouts/AppLayout";
import { SignUp } from "@clerk/nextjs";

const Page: NextPageWithLayout = () => {
  return <SignUp />;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
