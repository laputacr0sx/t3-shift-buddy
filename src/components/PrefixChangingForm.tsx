"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { prefixRegex } from "~/utils/regex";
import { type WeekPrefix } from "@prisma/client";
import moment from "moment";
import { api } from "~/utils/api";

const prefixFormSchema = z.object({
  weekNumber: z.number().min(1).max(52),
  Mon: z.string().regex(prefixRegex),
  Tue: z.string().regex(prefixRegex),
  Wed: z.string().regex(prefixRegex),
  Thu: z.string().regex(prefixRegex),
  Fri: z.string().regex(prefixRegex),
  Sat: z.string().regex(prefixRegex),
  Sun: z.string().regex(prefixRegex),
});

interface PropsType {
  dates: Date[];
  prefixes?: WeekPrefix;
}

function PrefixChangingForm(props: PropsType) {
  const { mutate: updatePrefixes, isLoading: updatingPrefixes } =
    api.prefixController.createNextWeekPrefix.useMutation({});

  // 1. Define your form.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const prefixForm = useForm<z.infer<typeof prefixFormSchema>>({
    resolver: zodResolver(prefixFormSchema),
    defaultValues: {
      weekNumber: parseInt(moment().format("W")),
      Mon: `${props.prefixes?.prefixes[0] || ""}`,
      Tue: `${props.prefixes?.prefixes[2] || ""}`,
      Wed: `${props.prefixes?.prefixes[2] || ""}`,
      Thu: `${props.prefixes?.prefixes[3] || ""}`,
      Fri: `${props.prefixes?.prefixes[4] || ""}`,
      Sat: `${props.prefixes?.prefixes[5] || ""}`,
      Sun: `${props.prefixes?.prefixes[6] || ""}`,
    },
  });
  // 2. Define a submit handler.
  function prefixFormHandler(values: z.infer<typeof prefixFormSchema>) {
    const orderedPrefixArray: string[] = [
      values.Mon,
      values.Tue,
      values.Wed,
      values.Thu,
      values.Fri,
      values.Sat,
      values.Sun,
    ];

    const validatedFormInput = {
      prefixes: orderedPrefixArray,
      weekNumber: values.weekNumber,
    };

    updatePrefixes(validatedFormInput);
  }

  return (
    <Form {...prefixForm}>
      <form
        onSubmit={prefixForm.handleSubmit(prefixFormHandler)}
        className="space-y-2"
      >
        <FormField
          key={props.dates[0]?.toISOString()}
          control={prefixForm.control}
          name="Mon"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row items-center justify-between gap-1 text-left font-mono">
                <FormLabel className="items-center">
                  {moment(props.dates[0]).format("D/MMM ddd")}
                </FormLabel>
                <FormControl>
                  <Input {...field} size={5} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          key={props.dates[1]?.toISOString()}
          control={prefixForm.control}
          name="Tue"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row items-center justify-center gap-1 text-left">
                <FormLabel className="items-center">
                  {moment(props.dates[1]).format("D/MMM ddd")}
                </FormLabel>
                <FormControl>
                  <Input {...field} size={5} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          key={props.dates[2]?.toISOString()}
          control={prefixForm.control}
          name="Wed"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row items-center justify-center gap-1 text-left">
                <FormLabel className="items-center">
                  {moment(props.dates[2]).format("D/MMM ddd")}
                </FormLabel>
                <FormControl>
                  <Input {...field} size={5} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          key={props.dates[3]?.toISOString()}
          control={prefixForm.control}
          name="Thu"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row items-center justify-center gap-1 text-left">
                <FormLabel className="items-center">
                  {moment(props.dates[3]).format("D/MMM ddd")}
                </FormLabel>
                <FormControl>
                  <Input {...field} size={5} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          key={props.dates[4]?.toISOString()}
          control={prefixForm.control}
          name="Fri"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row items-center justify-center gap-1 text-left">
                <FormLabel className="items-center">
                  {moment(props.dates[4]).format("D/MMM ddd")}
                </FormLabel>
                <FormControl>
                  <Input {...field} size={5} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          key={props.dates[5]?.toISOString()}
          control={prefixForm.control}
          name="Sat"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row items-center justify-center gap-1 text-left">
                <FormLabel className="items-center">
                  {moment(props.dates[5]).format("D/MMM ddd")}
                </FormLabel>
                <FormControl>
                  <Input {...field} size={5} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          key={props.dates[6]?.toISOString()}
          control={prefixForm.control}
          name="Sun"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row items-center justify-center gap-1 text-left">
                <FormLabel className="items-center">
                  {moment(props.dates[6]).format("D/MMM ddd")}
                </FormLabel>
                <FormControl>
                  <Input {...field} size={5} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant={"secondary"} disabled={updatingPrefixes}>
          去吧！
        </Button>
      </form>
    </Form>
  );
}

export default PrefixChangingForm;
