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
import toast from "react-hot-toast";

function UserMetadataForm() {
  const { data: userData } = api.userController.getUserMetadata.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { mutate, status } = api.userController.setUserMetadata.useMutation({
    onSuccess: () => toast.success("保存成功"),
    onError: () => toast.error("保存失敗"),
    onMutate: () => toast.loading("保存中..."),
    onSettled: () => toast.dismiss(),
  });

  const userPrivateMetadataForm = useForm<
    z.infer<typeof userPrivateMetadataSchema>
  >({
    resolver: zodResolver(userPrivateMetadataSchema),
    defaultValues: {
      row: "",
      staffId: "",
    },
    values: userData,
  });

  function metadataHandler(values: z.infer<typeof userPrivateMetadataSchema>) {
    return mutate(values);
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
              <FormLabel>職員號碼</FormLabel>
              <FormControl>
                <Input {...field} disabled={!!userData?.staffId} />
              </FormControl>
              <FormDescription>職員號碼一經輸入，不可更改。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={userPrivateMetadataForm.control}
          name="row"
          render={({ field }) => (
            <FormItem>
              <FormLabel>行序編號</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                編號為每一筆資料的編號，以便於查詢。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
          <Button type="submit" variant={"outline"} disabled={!!userData}>
            更改
          </Button>
          <Button type="reset" variant={"destructive"}>
            重設
          </Button>
        </div>
      </form>
    </Form>
  );
}

const User: NextPageWithLayout = () => (
  <React.Fragment>
    <h1
      id="title"
      className="justify-center py-5 text-center text-4xl font-semibold text-foreground"
    >
      用戶資料
    </h1>
    <UserMetadataForm />
  </React.Fragment>
);

User.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default User;
