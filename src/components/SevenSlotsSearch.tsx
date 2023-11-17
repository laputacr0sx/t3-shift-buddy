import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { type SubmitHandler, useForm } from "react-hook-form";

import { useRouter } from "next/router";

import moment from "moment";
import { autoPrefix, isTodayAfterWednesday } from "~/utils/helper";
import { inputShiftCodeRegex } from "~/utils/regex";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";

import toast from "react-hot-toast";

const dayDetailName = `Y${moment().year()}W${moment().week() + 1}`;

const sevenSlotsSearchFormSchema = z.object({
  [dayDetailName]: z
    .object({
      shiftCode: z
        .string()
        .regex(inputShiftCodeRegex, "不正確輸入")
        .max(7, "最長更號不多於7個字，例991106a / 881101a"),
    })
    .array(),
});

type sevenSlotsSearchForm = z.infer<typeof sevenSlotsSearchFormSchema>;

const SevenSlotsSearchForm = () => {
  const router = useRouter();
  const [autoDayDetail, setAutoDayDetail] = useState<
    ReturnType<typeof autoPrefix>
  >([]);
  const [isValidQuery, setIsValidQuery] = useState(false);

  useEffect(() => {
    setAutoDayDetail(autoPrefix(true));
  }, []);

  useEffect(() => {
    setIsValidQuery(Object.keys(router.query).length > 0);
  }, [router.query]);

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
      // [dayDetailName]: new Array(autoDayDetail.length).fill({
      //   shiftCode: "",
      // }),
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

  const prefixFormHandler: SubmitHandler<sevenSlotsSearchForm> = async (
    data
  ) => {
    const queryObject: Record<string, any> = {};

    const weekDetails = data[dayDetailName]?.reduce<
      { shiftCode: string; date: Date }[]
    >((weekDetails, dayDetail, i) => {
      const date = moment(autoDayDetail[i]?.date, "YYYYMMDD ddd").toDate();

      if (dayDetail.shiftCode) {
        weekDetails.push({ shiftCode: dayDetail.shiftCode, date });
      }
      // else {
      //   result.push({ shiftCode: "0", date });
      // }
      return weekDetails;
    }, []);

    for (const detail of weekDetails || []) {
      const dayString = moment(detail.date).format("YYYYMMDD");

      queryObject[dayString] = detail.shiftCode;
    }

    // console.log({ queryString });

    await router.push({
      pathname: "/weekdetails/",
      query: queryObject,
    });
  };

  return (
    <>
      <p className="justify-center text-center text-xs font-thin text-foreground"></p>
      <Form {...sevenSlotsSearchForm}>
        <form
          onSubmit={sevenSlotsSearchForm.handleSubmit(prefixFormHandler)}
          className="flex w-fit flex-col space-y-2 "
        >
          <FormDescription>期數：{dayDetailName}</FormDescription>
          {autoDayDetail.map((day, i) => {
            return (
              <fieldset key={day.date}>
                <section className="flex items-center justify-center gap-2">
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
                                className="w-[90px] font-mono tracking-wide"
                                placeholder="101"
                                autoCapitalize="characters"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                              />
                            </FormControl>
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
          <div className="flex justify-center gap-8">
            <Button type="submit" variant={"outline"}>
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
      {isValidQuery ? <>This is query component</> : null}
    </>
  );
};

export default SevenSlotsSearchForm;
