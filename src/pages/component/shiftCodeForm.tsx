"use client";

// import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "~/component/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/component/ui/form";
import { Input } from "~/component/ui/input";
import { useForm } from "react-hook-form";
import router from "next/router";

const formSchema = z.object({
  shiftCode: z.string().regex(new RegExp("")),
});

export default function shiftCodeForm() {
  // 1. Define your form.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shiftCode: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    console.log(values);

    await router.push(`/${values.shiftCode}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="shiftCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>更號</FormLabel>
              <FormControl>
                <Input placeholder="D15159 / 159 " {...field} />
              </FormControl>
              <FormDescription>輸入想查找的更號</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">去吧！</Button>
      </form>
    </Form>
  );
}
