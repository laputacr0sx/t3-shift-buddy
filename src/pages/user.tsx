import React, { ReactElement } from "react";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TableLoading from "~/components/TableLoading";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "~/components/ui/form";
import { api } from "~/utils/api";
import { userPrivateMetadataSchema } from "~/utils/zodSchemas";
import { Input } from "~/components/ui/input";
import { NextPageWithLayout } from "./_app";
import Layout from "~/components/ui/layouts/AppLayout";

function UserMetadataForm() {
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = api.userController.getUserMetadata.useQuery();

  const userPrivateMetadataForm = useForm<
    z.infer<typeof userPrivateMetadataSchema>
  >({
    resolver: zodResolver(userPrivateMetadataSchema),
    values: {
      staffId: userData?.staffId as string,
      row: userData?.row as string,
    },
  });
  // 2. Define a submit handler.
  function metadataHandler(values: z.infer<typeof userPrivateMetadataSchema>) {
    return { ...values };
  }

  return (
    <Form {...userPrivateMetadataForm}>
      <form
        onSubmit={userPrivateMetadataForm.handleSubmit(metadataHandler)}
        className="space-y-8"
      >
        <FormField
          control={userPrivateMetadataForm.control}
          name="staffId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>StaffId</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant={"secondary"}>
          預覽
        </Button>
      </form>
    </Form>
  );
}

const User: NextPageWithLayout = () => {
  return <UserMetadataForm />;
  return <div>happy</div>;
};

User.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default User;
