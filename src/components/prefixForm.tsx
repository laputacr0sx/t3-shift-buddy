"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import router from "next/router";

const prefixFormSchema = z.object({
  shiftCode: z.string(),
});

export default function prefixForm() {
  // 1. Define your form.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const prefixForm = useForm<z.infer<typeof prefixFormSchema>>({
    resolver: zodResolver(prefixFormSchema),
    defaultValues: {
      shiftCode: "",
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof prefixFormSchema>) {
    await router.push(`/${values.shiftCode}`);
  }

  return (
    <Form {...prefixForm}>
      <form onSubmit={prefixForm.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={prefixForm.control}
          name="shiftCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>更號</FormLabel>
              <FormControl>
                <Input placeholder="D15159 / 159" {...field} required={false} />
              </FormControl>
              <FormDescription>請輸入想查找的更號</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant={"secondary"}>
          去吧！
        </Button>
      </form>
    </Form>
  );
}
