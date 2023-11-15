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
import { SubmitHandler, useForm } from "react-hook-form";

import { useRouter } from "next/router";

import moment from "moment";
import { autoPrefix } from "~/utils/helper";
import { inputShiftCodeRegex } from "~/utils/regex";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
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
    .array()
    .length(7),
});

type sevenSlotsSearchForm = z.infer<typeof sevenSlotsSearchFormSchema>;

// document this react component

const SevenSlotsSearchForm = ({
  preloadSequence,
}: {
  preloadSequence?: string;
}) => {
  const router = useRouter();
  const [autoDayDetail, setAutoDayDetail] = useState<
    ReturnType<typeof autoPrefix>
  >([]);

  useEffect(() => {
    setAutoDayDetail(autoPrefix());
  }, []);

  if (typeof preloadSequence !== "undefined") {
  }

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

      console.log({ temp: JSON.stringify(Object.values(zodResolved.values)) });

      // console.log(JSON.stringify(zodResolved.values));

      return zodResolved;
    },
    // resolver: zodResolver(sevenSlotsSearchFormSchema),
    mode: "onChange",
    defaultValues: {
      [dayDetailName]: [
        {
          shiftCode: "",
        },
        {
          shiftCode: "",
        },
        {
          shiftCode: "",
        },
        {
          shiftCode: "",
        },
        {
          shiftCode: "",
        },
        {
          shiftCode: "",
        },
        {
          shiftCode: "",
        },
      ],
    },
  });

  const prefixFormHandler: SubmitHandler<sevenSlotsSearchForm> = async (
    data
  ) => {
    let queryString = "";
    let weekNumber;

    const weekDetails = data[dayDetailName]?.reduce<
      { shiftCode: string; date: Date }[]
    >((result, dayDetail, i) => {
      const date = moment(autoDayDetail[i]?.date, "YYYYMMDD ddd").toDate();
      weekNumber = moment(date).isoWeek();
      if (dayDetail.shiftCode) {
        result.push({ shiftCode: dayDetail.shiftCode, date });
      }
      // else {
      //   result.push({ shiftCode: "0", date });
      // }
      return result;
    }, []);

    for (const detail of weekDetails || []) {
      const dayString = moment(detail.date).locale("en").format("dd");
      const result = `${dayString}${detail.shiftCode}`;
      queryString += result;
    }

    // console.log({ queryString });

    if (queryString.length <= 0) {
      toast("請輸入最少一更", {
        icon: "❌",
        className: "dark:bg-red-950 dark:text-foreground",
      });
    }

    await router.push({
      pathname: "/weekdetails/[shiftsequence]",
      query: {
        shiftsequence: queryString,
        weekNumber,
        // date: true, ignore: true
      },
    });
  };

  return (
    <>
      <h2 className="justify-center py-2 text-center text-xl font-medium text-foreground">
        期數：{dayDetailName}
      </h2>
      <Form {...sevenSlotsSearchForm}>
        <form
          onSubmit={sevenSlotsSearchForm.handleSubmit(prefixFormHandler)}
          className="flex w-fit flex-col space-y-2 "
        >
          <FormDescription></FormDescription>
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
                                placeholder="101/991106"
                                autoCapitalize="characters"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                autoFocus
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  {/* <FormField
                  control={sevenSlotsSearchForm.control}
                  name={`${dayDetailName}[${i}].dayOff` as const}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center justify-between gap-4 font-mono">
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    );
                  }}
                /> */}
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
    </>
  );
};

export default SevenSlotsSearchForm;
