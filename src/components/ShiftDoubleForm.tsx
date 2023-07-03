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

import { shiftCodeRegex, shiftRowRegex } from "~/lib/regex";

const codeFormSchema = z.object({
  shiftCode: z
    .string()
    .regex(
      shiftCodeRegex,
      `請正確輸入更號[時間表][番號]或[番號], 例：D15101或101`
    ),
});

const rowFormSchema = z.object({
  shiftRow: z.string().regex(shiftRowRegex, "輸入更號不正確"),
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
      <p>{JSON.stringify(rowForm.control.getFieldState)}</p>
      <Form {...codeForm}>
        <form
          onSubmit={codeForm.handleSubmit(onSubmitForCode)}
          className="space-y-8 "
        >
          <FormField
            control={codeForm.control}
            name="shiftCode"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>更號</FormLabel>
                <FormControl>
                  <Input
                    className="font-mono tracking-wide"
                    placeholder="D15159 / 159"
                    {...field}
                  />
                </FormControl>
                <FormDescription className=" break-words font-mono tracking-wide">
                  請輸入想查找的更號
                </FormDescription>
                <FormMessage className=" tracking-wide" />
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
                  />
                </FormControl>
                <FormDescription className=" break-words font-mono tracking-wide">
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
