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
import { useSpring, config } from "@react-spring/web";

import { useRouter } from "next/router";

import moment from "moment";
import { autoPrefix } from "~/utils/helper";
import { abbreviatedDutyNumber, inputShiftCodeRegex } from "~/utils/regex";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { api } from "~/utils/api";
import { useSearchParams } from "next/navigation";

const dayDetailName = `Y${moment().year()}W${moment().week() + 1}`;

const sevenSlotsSearchFormSchema = z.object({
  [dayDetailName]: z
    .object({
      shiftCode: z
        .string()
        .regex(inputShiftCodeRegex, "不正確輸入")
        .max(7, "最長更號不多於7個字，例991106a / 881101a"),
    })
    .array()
    .min(1, "At least one shift code must be provided"),
});

type sevenSlotsSearchForm = z.infer<typeof sevenSlotsSearchFormSchema>;

const SevenSlotsSearchForm = () => {
  const searchParams = useSearchParams();

  const router = useRouter();
  const queryResultRef = useRef<HTMLElement | null>(null);

  const [autoDayDetail, setAutoDayDetail] = useState<
    ReturnType<typeof autoPrefix>
  >([]);

  useEffect(() => {
    setAutoDayDetail(autoPrefix(true));
  }, []);

  const getShiftArrayFromSearchParam = useMemo(() => {
    const dateAndShifts: Record<string, string>[] = [];
    if (!searchParams?.size) return;
    for (const [date, shiftCode] of searchParams) {
      dateAndShifts.push({ date, shiftCode });
    }
    return dateAndShifts;
  }, [searchParams]);

  const { data: shiftDetail, isLoading: shiftDetailLoading } =
    api.shiftController.getShiftDetailWithNumericPrefix.useQuery(
      getShiftArrayFromSearchParam,
      {
        refetchOnWindowFocus: false,
        enabled: !!getShiftArrayFromSearchParam,
      }
    );

  const sevenSlotsSearchForm = useForm<sevenSlotsSearchForm>({
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
      ],
    },
  });

  const onValidPrefixFormHandler: SubmitHandler<sevenSlotsSearchForm> = async (
    data
  ) => {
    const queryObject = data[dayDetailName]?.reduce<Record<string, string>>(
      (dayDetails, dayDetail, i) => {
        const date = moment(autoDayDetail[i]?.date, "YYYYMMDD ddd").format(
          "YYYYMMDD"
        );
        const prefix = autoDayDetail[i]?.prefix as string;

        const shiftCodeWithPrefix = dayDetail.shiftCode.match(
          abbreviatedDutyNumber
        )
          ? `${prefix}${dayDetail.shiftCode}`
          : `${dayDetail.shiftCode}`;

        if (dayDetail.shiftCode) {
          dayDetails[date] = shiftCodeWithPrefix;
        }
        return dayDetails;
      },
      {}
    );

    await router.push(
      {
        pathname: router.pathname,
        query: queryObject,
      },
      undefined,
      {
        scroll: false,
      }
    );

    // await router.push({ pathname: router.pathname });
  };

  const onInvalidPrefixFormHandler: SubmitErrorHandler<sevenSlotsSearchForm> = (
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
              disabled={!!sevenSlotsSearchForm.formState.errors.root?.message}
            >
              查下週更資料
            </Button>
            <Button
              type="reset"
              variant={"destructive"}
              onClick={async () => {
                sevenSlotsSearchForm.reset();
                await router.replace("/weekdetails");
              }}
            >
              重置
            </Button>
          </div>
        </form>
      </Form>
      {searchParams?.size ? (
        <section id="query-result" ref={queryResultRef} className="bg h-screen">
          <h1 className="justify-center py-5 text-center text-4xl font-semibold text-foreground">
            Query Result
          </h1>
          <Link href="#title">Back To Top</Link>
          {shiftDetailLoading ? null : (
            <p className="w-full break-words">{JSON.stringify(shiftDetail)}</p>
          )}
        </section>
      ) : null}
    </>
  );
};

export default SevenSlotsSearchForm;
