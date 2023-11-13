import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import router from "next/router";

import moment from "moment";
import { autoPrefix } from "~/utils/helper";
import { inputShiftCodeRegex } from "~/utils/regex";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

const dayDetailName = `Y${moment().year()}W${moment().week()}`;

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

const SevenSlotsSearchForm = () => {
  const [autoDayDetail, setAutoDayDetail] = useState<
    ReturnType<typeof autoPrefix>
  >([]);

  useEffect(() => {
    setAutoDayDetail(autoPrefix());
  }, []);

  const sevenSlotsSearchForm = useForm<sevenSlotsSearchForm>({
    resolver: async (data, context, options) => {
      // you can debug your validation schema here
      // console.log("formData", data);
      // console.log(
      //   "validation result",
      //   await zodResolver(sevenSlotsSearchFormSchema)(data, context, options)
      // );
      return zodResolver(sevenSlotsSearchFormSchema)(data, context, options);
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

  // m: Monday,
  // t: Tuesday,
  // w: Wednesday,
  // r: Thursday,
  // f: Friday,
  // s: Saturday,
  // u: Sunday

  const prefixFormHandler: SubmitHandler<sevenSlotsSearchForm> = async (
    data
  ) => {
    let urlParams = "";

    const weekDetails = data[dayDetailName]?.reduce<
      { shiftCode: string; date: Date }[]
    >((result, dayDetail, i) => {
      if (dayDetail.shiftCode) {
        const date = moment(autoDayDetail[i]?.date, "YYYYMMDD ddd").toDate();
        result.push({ shiftCode: dayDetail.shiftCode, date });
      }
      return result;
    }, []);

    for (const detail of weekDetails || []) {
      const dayString = moment(detail.date).locale("en").format("dd");

      const result = `${dayString}${detail.shiftCode}`;
      console.log(result);
      urlParams += result;
    }

    // await router.push(`weekdetails/${urlParams}`);

    await router.push({
      pathname: "/weekdetails/[shiftsequence]",
      query: { shiftsequence: urlParams },
    });

    // for (const { shiftCode } of data[dayDetailName] || []) {
    //   console.log(shiftCode ? shiftCode : "empty");
    // }
    // await router.push(`/weekdetails/123`);
  };

  return (
    <Form {...sevenSlotsSearchForm}>
      <form
        onSubmit={sevenSlotsSearchForm.handleSubmit(prefixFormHandler)}
        className="flex w-fit flex-col space-y-2 "
      >
        <fieldset className="flex justify-between font-mono">
          <Label>Date</Label>
          <Label>Number</Label>
        </fieldset>
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
            onClick={() => {
              sevenSlotsSearchForm.reset();
            }}
          >
            重置
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SevenSlotsSearchForm;
