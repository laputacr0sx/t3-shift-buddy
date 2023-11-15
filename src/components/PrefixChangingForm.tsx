"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
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
import { getWeekNumberByDate } from "~/utils/helper";

const prefixFormSchema = z.object({
  weekNumber: z.number().min(1).max(52),
  Mon: z.string().regex(prefixRegex, "Prefix format Error"),
  Tue: z.string().regex(prefixRegex, "Prefix format Error"),
  Wed: z.string().regex(prefixRegex, "Prefix format Error"),
  Thu: z.string().regex(prefixRegex, "Prefix format Error"),
  Fri: z.string().regex(prefixRegex, "Prefix format Error"),
  Sat: z.string().regex(prefixRegex, "Prefix format Error"),
  Sun: z.string().regex(prefixRegex, "Prefix format Error"),
});

type PrefixFormSchema = z.infer<typeof prefixFormSchema>;

type PropsType = {
  dates: Date[];
  weekPrefix?: WeekPrefix;
};

function PrefixChangingForm(props: PropsType) {
  const currentWeekNumber = getWeekNumberByDate();

  const { mutate: updatePrefixes, isLoading: updatingPrefixes } =
    api.prefixController.createNextWeekPrefix.useMutation({
      onSuccess: async () => {
        await api
          .useContext()
          .prefixController.getPrefixGivenWeekNumber.invalidate();
      },
    });

  const prefixForm = useForm<PrefixFormSchema>({
    resolver: zodResolver(prefixFormSchema),
    defaultValues: {
      weekNumber: currentWeekNumber + 1,
      Mon: `${props.weekPrefix?.prefixes[0] || ""}`,
      Tue: `${props.weekPrefix?.prefixes[1] || ""}`,
      Wed: `${props.weekPrefix?.prefixes[2] || ""}`,
      Thu: `${props.weekPrefix?.prefixes[3] || ""}`,
      Fri: `${props.weekPrefix?.prefixes[4] || ""}`,
      Sat: `${props.weekPrefix?.prefixes[5] || ""}`,
      Sun: `${props.weekPrefix?.prefixes[6] || ""}`,
    },
    mode: "onBlur",
  });
  // 2. Define a submit handler.
  function prefixFormHandler(values: PrefixFormSchema) {
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
        className=" flex w-fit flex-col space-y-2"
      >
        {/* {props.dates.map((date, i) => {
          const autoName = moment(date).format("ddd");

          return (
            <FormField
              key={props.dates[i]?.toISOString()}
              control={prefixForm.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-4 font-mono">
                    <FormLabel className="items-center">
                      {moment(props.dates[i]).format("D/MMM ddd")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-14 text-center"
                        maxLength={3}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })} */}
        <FormField
          key={props.dates.join()}
          control={prefixForm.control}
          name="weekNumber"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-4 font-mono">
                <FormLabel className="items-center justify-center">
                  更表期數
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-14 text-center"
                    maxLength={3}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          key={props.dates[0]?.toISOString()}
          control={prefixForm.control}
          name="Mon"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-4 font-mono">
                <FormLabel className="items-center">
                  {moment(props.dates[0]).format("D/MMM ddd")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-14 text-center"
                    maxLength={3}
                  />
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
              <div className="flex  items-center justify-between gap-4  font-mono">
                <FormLabel className="items-center">
                  {moment(props.dates[1]).format("D/MMM ddd")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-14 text-center"
                    maxLength={3}
                  />
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
              <div className="flex  items-center justify-between gap-4  font-mono">
                <FormLabel className="items-center">
                  {moment(props.dates[2]).format("D/MMM ddd")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-14 text-center"
                    maxLength={3}
                  />
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
              <div className="flex  items-center justify-between gap-4  font-mono">
                <FormLabel className="items-center">
                  {moment(props.dates[3]).format("D/MMM ddd")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-14 text-center"
                    maxLength={3}
                  />
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
              <div className="flex  items-center justify-between gap-4  font-mono">
                <FormLabel className="items-center">
                  {moment(props.dates[4]).format("D/MMM ddd")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-14 text-center"
                    maxLength={3}
                  />
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
              <div className="flex  items-center justify-between gap-4  font-mono">
                <FormLabel className="items-center">
                  {moment(props.dates[5]).format("D/MMM ddd")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-14 text-center"
                    maxLength={3}
                  />
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
              <div className="flex  items-center justify-between gap-4  font-mono">
                <FormLabel className="items-center">
                  {moment(props.dates[6]).format("D/MMM ddd")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-14 text-center"
                    maxLength={3}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant={"secondary"}
          disabled={updatingPrefixes}
          className="items-center justify-center self-center tracking-wider"
        >
          {`更改${currentWeekNumber + 1}週時間表`}
        </Button>
      </form>
    </Form>
  );
}

export default PrefixChangingForm;
