import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import {
  type SubmitHandler,
  type SubmitErrorHandler,
  useForm,
} from "react-hook-form";

import moment from "moment";
import { autoPrefix } from "~/utils/helper";
import { inputShiftCodeRegex } from "~/utils/regex";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import useShiftQuery from "~/hooks/useShiftQuery";

export const dayDetailName = `Y${moment().year()}W${moment().week() + 1}`;

const sevenSlotsSearchFormSchema = z.object({
  [dayDetailName]: z
    .object({
      shiftCode: z
        .string()
        .regex(inputShiftCodeRegex, "不是正確的更份號碼")
        .max(7, "最長更號不多於7個字，例991106a / 881101a"),
    })
    .array()
    .min(1, "At least one shift code must be provided"),
});

export type SevenSlotsSearchForm = z.infer<typeof sevenSlotsSearchFormSchema>;

const SevenSlotsSearchForm = () => {
  const { router, handleQuery } = useShiftQuery();
  const [newSearchParams, setNewSearchParams] =
    useState<URLSearchParams | null>(null);

  const autoDayDetail = useMemo(() => autoPrefix(true), []);

  const getShiftArrayFromSearchParam = useMemo(() => {
    const dateAndShifts: { date: string; shiftCode: string }[] = [];
    if (newSearchParams === null) return dateAndShifts;
    for (const [date, shiftCode] of newSearchParams) {
      dateAndShifts.push({ date, shiftCode });
    }
    return dateAndShifts;
  }, [newSearchParams]);

  console.log(getShiftArrayFromSearchParam);

  console.log("form component is rendered");

  const sevenSlotsSearchForm = useForm<SevenSlotsSearchForm>({
    resolver: async (data, context, options) => {
      // you can debug your validation schema here
      // console.log("formData", data);
      // console.log(
      //   "validation result",
      //   await zodResolver(sevenSlotsSearchFormSchema)(data, context, options)
      // );
      const zodResolved = await zodResolver(sevenSlotsSearchFormSchema)(
        data,
        context,
        options
      );

      return zodResolved;
    },
    // resolver: zodResolver(sevenSlotsSearchFormSchema),
    mode: "onBlur",
    defaultValues: {
      [dayDetailName]: [
        { shiftCode: "" },
        { shiftCode: "" },
        { shiftCode: "" },
        { shiftCode: "" },
        { shiftCode: "" },
        { shiftCode: "" },
        { shiftCode: "" },
        { shiftCode: "" },
        { shiftCode: "" },
        { shiftCode: "" },
        { shiftCode: "" },
      ],
    },
  });

  const handleQueryCb = useCallback(
    async (data: SevenSlotsSearchForm) =>
      await handleQuery(autoDayDetail, data),
    [autoDayDetail, handleQuery]
  );

  const onValidPrefixFormHandler: SubmitHandler<SevenSlotsSearchForm> = async (
    data
  ) => {
    const newSearch = await handleQueryCb(data);
    setNewSearchParams(newSearch);
    await router.push("#query-result");
  };

  const onInvalidPrefixFormHandler: SubmitErrorHandler<SevenSlotsSearchForm> = (
    error
  ) => {
    console.error({ error });
    //
  };

  return (
    <>
      <Link href={"#query-result"}>To result</Link>

      <Form {...sevenSlotsSearchForm}>
        <form
          id="form"
          onSubmit={sevenSlotsSearchForm.handleSubmit(
            onValidPrefixFormHandler,
            onInvalidPrefixFormHandler
          )}
          className="flex min-h-screen w-full flex-col items-stretch space-y-2 px-12"
        >
          <FormDescription>期數：{dayDetailName}</FormDescription>
          {autoDayDetail.map((day, i) => {
            return (
              <fieldset key={day.date}>
                <section className="flex items-stretch justify-between gap-2">
                  <FormField
                    control={sevenSlotsSearchForm.control}
                    name={`${dayDetailName}[${i}].shiftCode`}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <div className="flex items-center justify-between gap-4 font-mono">
                            <FormLabel className="items-center">
                              {moment(day.date, "YYYYMMDD ddd").format(
                                `DD/MM(dd)`
                              )}{" "}
                              {autoDayDetail[i]?.prefix}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="w-[88px] font-mono tracking-wide"
                                maxLength={7}
                                placeholder="101"
                                autoCapitalize="characters"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                              />
                            </FormControl>
                            <FormDescription>
                              {sevenSlotsSearchForm.watch(field.name)
                                ? field.value
                                : ""}
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </section>
              </fieldset>
            );
          })}
          <div className="flex items-center justify-center gap-8">
            <Button
              type="submit"
              variant={"outline"}
              // disabled={!!sevenSlotsSearchForm.formState.errors.root?.message}
            >
              查下週更資料
            </Button>
            <Button
              type="reset"
              variant={"destructive"}
              onClick={async () => {
                sevenSlotsSearchForm.reset();
                setNewSearchParams(null);
                await router.replace("/weekdetails#title");
              }}
            >
              重置
            </Button>
          </div>
        </form>
      </Form>
      {newSearchParams ? (
        <section id="query-result" className="bg h-screen">
          <h1 className="justify-center py-5 text-center text-4xl font-semibold text-foreground">
            未來更序
          </h1>
          <Link href="#title">Back To Top</Link>
        </section>
      ) : null}
    </>
  );
};

export default SevenSlotsSearchForm;
