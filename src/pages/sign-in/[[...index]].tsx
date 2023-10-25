import { SignIn } from "@clerk/nextjs";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import Layout from "~/components/ui/layouts/AppLayout";

const Page: NextPageWithLayout = () => {
  return <SignIn />;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
