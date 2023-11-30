import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import moment from "moment";

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
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";

import {
  type SubmitHandler,
  type SubmitErrorHandler,
  useForm,
} from "react-hook-form";

import { api } from "~/utils/api";
import { autoPrefix } from "~/utils/helper";
import { abbreviatedDutyNumber, inputShiftCodeRegex } from "~/utils/regex";
import useShiftQuery from "~/hooks/useShiftQuery";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { DayDetailTable } from "./ShiftTable/DayDetailTable";
import { DayDetailColumn } from "./ShiftTable/DayDetailColumn";

import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";

import { encode } from "querystring";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { dayOff } from "~/utils/customTypes";
import { cn } from "~/lib/utils";

export const dayDetailName = `Y${moment().year()}W${moment().week() + 1}`;

const sevenSlotsSearchFormSchema = z.object({
  [dayDetailName]: z
    .object({
      shiftCode: z
        .string()
        .regex(inputShiftCodeRegex, "錯誤更份號碼")
        .max(7, "最長更號不多於7個字，例991127A / 881101a"),
    })
    .array()
    .min(1, "At least one shift code must be provided"),
});

export type SevenSlotsSearchForm = z.infer<typeof sevenSlotsSearchFormSchema>;

const SevenSlotsSearchForm = () => {
  const [parent] = useAutoAnimate();

  const { router, handleQuery } = useShiftQuery();
  const [newSearchParams, setNewSearchParams] =
    useState<URLSearchParams | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(encode(router.query));
    !!queryParams.size && setNewSearchParams(queryParams);
  }, [router.query]);

  const autoDayDetail = useMemo(() => autoPrefix(true), []);

  const shiftsFromSearchParamMemo = useMemo(() => {
    const dateAndShifts: { date: string; shiftCode: string }[] = [];
    if (newSearchParams === null) return dateAndShifts;
    for (const [date, shiftCode] of newSearchParams) {
      dateAndShifts.push({ date, shiftCode });
    }
    return dateAndShifts;
  }, [newSearchParams]);

  const {
    data: queryData,
    isLoading: queryIsLoading,
    error: queryError,
  } = api.shiftController.getShiftDetailWithoutAlphabeticPrefix.useQuery(
    shiftsFromSearchParamMemo,
    { enabled: !!shiftsFromSearchParamMemo.length, refetchOnWindowFocus: false }
  );

  const data = api.prefixController;

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
    mode: "onChange",
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

  const onValidPrefixFormHandler: SubmitHandler<SevenSlotsSearchForm> = async (
    data,
    event
  ) => {
    event?.preventDefault();
    const newSearch = await handleQuery(autoDayDetail, data);
    setNewSearchParams(newSearch);
    await router.push("#query-result");
  };

  const onInvalidPrefixFormHandler: SubmitErrorHandler<SevenSlotsSearchForm> = (
    error,
    event
  ) => {
    event?.preventDefault();
    console.error({ error });
  };

  return (
    <>
      {newSearchParams ? (
        <Button
          onClick={async () => {
            await router.push("#query-result");
          }}
          className="absolute right-2 top-6"
        >
          <ArrowDownToLine />
        </Button>
      ) : null}
      <Form {...sevenSlotsSearchForm}>
        <form
          id="form"
          onSubmit={sevenSlotsSearchForm.handleSubmit(
            onValidPrefixFormHandler,
            onInvalidPrefixFormHandler
          )}
          className="flex min-h-screen w-full flex-col items-center space-y-1"
        >
          <FormDescription className="pb-2 text-xs">
            <p>於輸入框內輸入更號，例：</p>
            <p>
              J15101則輸入101；
              991104則輸入991104；881113則輸入881113；如此類推。
            </p>
          </FormDescription>
          {autoDayDetail.map((day, i) => {
            const correspondingDate = moment(day.date, "YYYYMMDD ddd");
            const isOff = false;

            const formatedDate = correspondingDate.format("DD/MM(dd)");

            const isRedDay =
              correspondingDate.isoWeekday() === 6 ||
              correspondingDate.isoWeekday() === 7 ||
              !!day.holidayDetails;

            const isMonday = correspondingDate.isoWeekday() === 1;

            return (
              <fieldset
                key={day.date}
                className="flex w-full flex-col justify-center gap-2"
              >
                {(i === 0 || isMonday) && (
                  <Badge variant={"outline"} className="w-fit border-green-400">
                    {`Y${correspondingDate.year()}W${correspondingDate.week()}`}
                  </Badge>
                )}
                <section
                // className="w-content flex flex-col gap-2 space-y-0 xs:w-full xs:flex-row xs:items-center xs:justify-between"
                >
                  {/* <Switch
                    disabled
                    defaultChecked
                    onCheckedChange={(checked) => {
                      sevenSlotsSearchForm.reset();
                      isOff = !checked;
                      console.log(isOff);
                    }}
                  /> */}

                  <FormField
                    control={sevenSlotsSearchForm.control}
                    name={`${dayDetailName}[${i}].shiftCode`}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          {/* <div className="flex w-full flex-col justify-between gap-1 font-mono xs:flex-row xs:items-center xs:justify-between xs:gap-2 "> */}
                          <div className="w-content flex flex-col gap-2 space-y-0 xs:w-full xs:flex-row xs:items-center xs:justify-start">
                            <FormLabel
                              className={cn(
                                "w-fit items-center rounded px-1 font-mono",
                                isRedDay &&
                                  "bg-rose-500/40 dark:bg-rose-300/40",
                                day.racingDetails?.nightRacing === 0
                                  ? "border-b-2 border-b-lime-500 dark:border-b-lime-300 "
                                  : day.racingDetails?.nightRacing === 1
                                  ? "border-b-2 border-b-violet-500 dark:border-b-violet-300"
                                  : day.racingDetails?.nightRacing === 2
                                  ? "border-b-2 border-b-amber-500 dark:border-b-amber-300"
                                  : ""
                              )}
                            >
                              {formatedDate}
                            </FormLabel>
                            {isOff ? (
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="請揀選假期類別" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {dayOff.map((off) => (
                                    <SelectItem key={off} value={off}>
                                      {off}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <FormControl>
                                <Input
                                  {...field}
                                  className="w-min font-mono tracking-tight focus-visible:ring-cyan-700 focus-visible:dark:ring-cyan-300"
                                  maxLength={7}
                                  placeholder={`xxx / xxxxxx`}
                                  autoCapitalize="characters"
                                  autoComplete="off"
                                  autoCorrect="off"
                                  spellCheck="false"
                                />
                              </FormControl>
                            )}
                            <FormDescription className="invisible font-mono tracking-wider xs:visible">
                              {sevenSlotsSearchForm.getValues(field.name) ? (
                                sevenSlotsSearchForm.control.getFieldState(
                                  field.name
                                ).invalid ? (
                                  `${day.prefix}___`
                                ) : (
                                  <>
                                    {(field.value as string).match(
                                      abbreviatedDutyNumber
                                    )
                                      ? `${day.prefix}${field.value as string}`
                                      : `${field.value as string}`}
                                  </>
                                )
                              ) : (
                                `${day.prefix}___`
                              )}
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
              disabled={!sevenSlotsSearchForm.formState.isDirty}
            >
              查下週更資料
            </Button>
            <Button
              type="reset"
              variant={"destructive"}
              onClick={async () => {
                sevenSlotsSearchForm.reset();
                setNewSearchParams(null);
                await router.replace("/");
                router.reload();
              }}
            >
              重置
            </Button>
          </div>
        </form>
      </Form>
      {newSearchParams ? (
        <section
          ref={parent}
          id="query-result"
          className="h-screen min-h-screen w-full items-center justify-center"
        >
          <h1 className="justify-center py-2 text-center text-2xl font-medium text-foreground">
            未來更序
          </h1>
          <Button
            onClick={async () => {
              await router.push("#title");
            }}
            className="absolute right-2 top-6"
          >
            <ArrowUpToLine />
          </Button>
          <br />
          {queryIsLoading ? (
            <div className="flex flex-col items-center justify-center gap-5 pt-5">
              <Skeleton className="h-80 w-72" />
            </div>
          ) : queryError ? (
            <p>{queryError.message}</p>
          ) : (
            <DayDetailTable columns={DayDetailColumn} data={queryData} />
          )}
        </section>
      ) : null}
    </>
  );
};

export default SevenSlotsSearchForm;
