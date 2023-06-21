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

const shiftCodeRegex = /(^\d{3}$)|(^(?:[A-Z])(?:1[3|4|5]|7[1|5])(\d{3}$))/gim;

const formSchema = z.object({
  shiftCode: z.string().regex(shiftCodeRegex),
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
