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
import { Separator } from "./ui/separator";

const shiftRowRegex =
  /((?:1|3|5|6)(?:[0-5])(?:\d{1})|(?:9|8)(?:\d{5})(?:[a-z]?)|(RD|CL|AL|GH|SH)){7}/gim;
const shiftCodeRegex =
  /(^\d{3}$)|(^(?:[A-Z])(?:1[3|4|5]|7[1|5])(\d{3}$)){1}/gim;

const codeFormSchema = z.object({
  shiftCode: z.string().regex(shiftCodeRegex),
});

const rowFormSchema = z.object({
  shiftRow: z.string().regex(shiftRowRegex),
});

export default function shiftDoubleForm() {
  // 1. Define your form.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const codeForm = useForm<z.infer<typeof codeFormSchema>>({
    resolver: zodResolver(codeFormSchema),
    defaultValues: {
      shiftCode: "",
    },
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const rowForm = useForm<z.infer<typeof rowFormSchema>>({
    resolver: zodResolver(rowFormSchema),
    defaultValues: {
      shiftRow: "",
    },
  });

  // 2. Define submit handlers.
  async function onSubmitForRow(values: z.infer<typeof rowFormSchema>) {
    await router.push(`/weekquery/${values.shiftRow}`);
  }

  async function onSubmitForCode(values: z.infer<typeof codeFormSchema>) {
    await router.push(`/simplequery/${values.shiftCode}`);
  }

  return (
    <>
      <Form {...codeForm}>
        <form
          onSubmit={codeForm.handleSubmit(onSubmitForCode)}
          className="space-y-8"
        >
          <FormField
            control={codeForm.control}
            name="shiftCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>更號</FormLabel>
                <FormControl>
                  <Input
                    placeholder="D15159 / 159"
                    {...field}
                    required={false}
                  />
                </FormControl>
                <FormDescription>請輸入想查找的更號</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant={"secondary"}>
            查更！
          </Button>
        </form>
      </Form>
      <Separator className={"my-6"} />
      <Form {...rowForm}>
        <form
          onSubmit={rowForm.handleSubmit(onSubmitForRow)}
          className="space-y-8"
        >
          <FormField
            control={rowForm.control}
            name="shiftRow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>整週更號</FormLabel>
                <FormControl>
                  <Input
                    className="font-mono tracking-wide"
                    placeholder="101102103104105106107RD"
                    {...field}
                    required={false}
                  />
                </FormControl>
                <FormDescription className=" trackwide break-words font-mono">
                  如更份為 D15101 D15102 B14103 D15104 D15105 A75106 RD
                  <br />
                  請輸入 101102103104105106RD
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant={"secondary"}>
            查一條更！
          </Button>
        </form>
      </Form>
    </>
  );
}
