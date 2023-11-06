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
import { prefixRegex } from "~/utils/regex";
import { type WeekPrefix } from "@prisma/client";
import moment from "moment";
import { api } from "~/utils/api";
import { autoPrefix, getWeekNumber } from "~/utils/helper";
import { Label } from "./ui/label";

const prefixFormSchema = z.object({
  weekNumber: z.number().min(1).max(52),
  weeks: z
    .object({
      alphabeticPrefix: z
        .string()
        .regex(/[a-z]/gi, "Only alphabetic characters allowed")
        .max(1),
      numericPrefix: z.string().regex(/(1[3|4|5]|7[1|5])/),
    })
    .array(),
});

type PrefixFormSchema = z.infer<typeof prefixFormSchema>;

type PropsType = {
  dates: Date[];
  weekPrefix?: WeekPrefix;
  autoPrefix: ReturnType<typeof autoPrefix>;
};

function DynamicUpdatePrefixForm(props: PropsType) {
  const currentWeekNumber = getWeekNumber();

  const { mutate: updatePrefixes, isLoading: updatingPrefixes } =
    api.prefixController.createNextWeekPrefix.useMutation({
      onSuccess: async () => {
        await api
          .useContext()
          .prefixController.getPrefixGivenWeekNumber.invalidate();
      },
    });

  const prefixDetails = props.weekPrefix?.prefixes.map((prefix, i) => {
    return {
      alphabeticPrefix: prefix.slice(0, 1),
      numericPrefix: props.autoPrefix[i]?.prefix,
    };
  });

  const prefixForm = useForm<PrefixFormSchema>({
    resolver: zodResolver(prefixFormSchema),
    defaultValues: {
      weekNumber: currentWeekNumber + 1,
      weeks: prefixDetails,
    },
    mode: "onChange",
  });

  function prefixFormHandler(values: PrefixFormSchema) {
    const completePrefix = values.weeks.map(
      ({ alphabeticPrefix, numericPrefix }) =>
        alphabeticPrefix.concat(numericPrefix)
    );
    console.log(completePrefix);

    updatePrefixes({
      weekNumber: values.weekNumber,
      prefixes: completePrefix,
    });
  }

  return (
    <Form {...prefixForm}>
      <form
        onSubmit={prefixForm.handleSubmit(prefixFormHandler)}
        className=" flex w-fit flex-col space-y-2"
      >
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
                    maxLength={1}
                    autoCapitalize="characters"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {props.dates.map((date, i) => {
          const autoPrefixOnDate = autoPrefix()[i];
          return (
            <fieldset key={date.toISOString()}>
              <section className="flex items-center justify-center">
                <FormField
                  control={prefixForm.control}
                  name={`weeks.${i}.alphabeticPrefix` as const}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between gap-4 font-mono">
                        <FormLabel className="items-center">
                          {moment(date).format("D/MM ddd")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="w-10 border-r-0 text-center"
                            maxLength={1}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  key={date.toISOString()}
                  control={prefixForm.control}
                  name={`weeks.${i}.numericPrefix` as const}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between gap-4 font-mono">
                        <FormControl>
                          <Input
                            {...field}
                            className="w-12 border-l-0 text-center"
                            maxLength={2}
                            placeholder={autoPrefixOnDate?.prefix}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <FormDescription>
                {autoPrefixOnDate?.racingDetails?.keyMatches}
                {autoPrefixOnDate?.holidayDetails?.summary}
              </FormDescription>
            </fieldset>
          );
        })}
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

export default DynamicUpdatePrefixForm;
