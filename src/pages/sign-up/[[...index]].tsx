import { SignUp } from "@clerk/nextjs";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import Layout from "~/components/ui/layouts/AppLayout";

const SignUpPage: NextPageWithLayout = () => (
  <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
);
export default SignUpPage;

SignUpPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
