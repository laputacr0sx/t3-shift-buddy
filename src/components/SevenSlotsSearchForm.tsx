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
import { abbreviatedDutyNumber, inputShiftCodeRegex } from "~/utils/regex";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";

import useShiftQuery from "~/hooks/useShiftQuery";
import { api } from "~/utils/api";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { DayDetailTable } from "./ShiftTable/DayDetailTable";
import { DayDetailColumn } from "./ShiftTable/DayDetailColumn";

import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { encode } from "querystring";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { dayOff } from "~/utils/customTypes";

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
          className=""
          onClick={async () => {
            await router.push("#query-result");
          }}
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
          className="flex min-h-screen w-full flex-col space-y-2 px-4"
        >
          <FormDescription>下週期數：{dayDetailName}</FormDescription>
          {autoDayDetail.map((day, i) => {
            const formatedDate = moment(day.date, "YYYYMMDD ddd").format(
              "DD/MM(dd)"
            );
            const isOff = false;
            return (
              <fieldset key={day.date}>
                <section className="flex items-center justify-start gap-2">
                  {/* <Switch
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
                          <div className="flex w-full items-center justify-between gap-2 font-mono">
                            <FormLabel className="items-center text-xs sm:tracking-tighter">
                              {formatedDate} {autoDayDetail[i]?.prefix}
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
                                  className="w-[88px] font-mono tracking-tight "
                                  maxLength={7}
                                  placeholder="101"
                                  autoCapitalize="characters"
                                  autoComplete="off"
                                  autoCorrect="off"
                                  spellCheck="false"
                                />
                              </FormControl>
                            )}
                            <FormDescription>
                              {sevenSlotsSearchForm.control.getFieldState(
                                field.name
                              ).invalid ? null : (
                                <>
                                  {(field.value as string).match(
                                    abbreviatedDutyNumber
                                  )
                                    ? `${day.prefix}${field.value as string}`
                                    : `${field.value as string}`}
                                </>
                              )}
                            </FormDescription>
                            <FormDescription ref={parent}>
                              <p
                                key={day.date}
                                className="text-xs font-thin tracking-tighter"
                              >
                                {day.holidayDetails?.summary ??
                                day.racingDetails?.venue === "S"
                                  ? "沙田"
                                  : day.racingDetails?.venue === "H"
                                  ? "跑馬地"
                                  : null}
                                {day.racingDetails?.nightRacing === 0
                                  ? "日馬"
                                  : day.racingDetails?.nightRacing === 1
                                  ? "夜馬"
                                  : day.racingDetails?.nightRacing === 2
                                  ? "黃昏馬"
                                  : null}
                              </p>
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
                await router.replace("/weekdetails");
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
