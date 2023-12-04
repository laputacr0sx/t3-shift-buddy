import { SignUp } from "@clerk/nextjs";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import Layout from "~/components/ui/layouts/AppLayout";

const SignUpPage: NextPageWithLayout = () => (
  <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
);
export default SignUpPage;

SignUpPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
