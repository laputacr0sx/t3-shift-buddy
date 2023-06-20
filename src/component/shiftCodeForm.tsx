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

const shiftRowRegex =
  /(?<duty>(?:1|3|5|6)(?:[0-5])(?:\d{1}))|(?<special>(?:9|8)(?:\d{5})(?:[a-z]?))|(?<rest>RD|CL|AL|GH|SH)/gim;

const shiftCodeRegex = /(^\d{3}$)|(^(?:[A-Z])(?:1[3|4|5]|7[1|5])(\d{3}$))/gim;

const formSchema = z.object({
  shiftCode: z.string().regex(shiftCodeRegex).optional(),
  shiftRow: z.string().regex(shiftRowRegex).optional(),
});

export default function shiftCodeForm() {
  // 1. Define your form.

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shiftCode: "",
      shiftRow: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values.shiftRow);

    if (values.shiftRow) {
      await router.push(`/${values.shiftRow}`);
      return;
    }
    if (values.shiftCode) {
      await router.push(`/${values.shiftCode}`);
      return;
    }
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
        <FormField
          control={form.control}
          name="shiftRow"
          render={({ field }) => (
            <FormItem>
              <FormLabel>整週更號</FormLabel>
              <FormControl>
                <Input
                  placeholder="101102103104105106107RD"
                  {...field}
                  required={false}
                />
              </FormControl>
              <FormDescription>
                i.e. 如下週更為D15101 D15102 B15103 D15104 D15105 A75106 RD
                請輸入 101102103104105106RD
              </FormDescription>
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
