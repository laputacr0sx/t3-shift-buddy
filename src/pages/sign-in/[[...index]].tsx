import { SignIn } from "@clerk/nextjs";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import Layout from "~/components/ui/layouts/AppLayout";

const SignInPage: NextPageWithLayout = () => (
  <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
);

export default SignInPage;

SignInPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
