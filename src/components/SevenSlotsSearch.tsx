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
import { type SubmitHandler, useForm } from "react-hook-form";
import { useSpring, config } from "@react-spring/web";

import { useRouter } from "next/router";

import moment from "moment";
import { autoPrefix } from "~/utils/helper";
import { inputShiftCodeRegex } from "~/utils/regex";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { encode } from "querystring";
import Link from "next/link";

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
  const queryResultRef = useRef<HTMLElement | null>(null);

  const [autoDayDetail, setAutoDayDetail] = useState<
    ReturnType<typeof autoPrefix>
  >([]);
  const [searchParams, setSearchParams] = useState<URLSearchParams>();

  const [y, setY] = useSpring(() => ({
    immediate: false,
    config: config.slow,
    y: 0,
    onFrame: (props: { y: number }) => {
      window.scroll(0, props.y);
    },
  }));

  useEffect(() => {
    setAutoDayDetail(autoPrefix(true));
  }, []);

  useEffect(() => {
    setSearchParams(new URLSearchParams(encode(router.query)));
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
    const queryObject = data[dayDetailName]?.reduce<Record<string, string>>(
      (dayDetails, dayDetail, i) => {
        const date = moment(autoDayDetail[i]?.date, "YYYYMMDD ddd").format(
          "YYYYMMDD"
        );
        if (dayDetail.shiftCode) {
          dayDetails[date] = dayDetail.shiftCode;
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
  };

  return (
    <>
      <Link href={"#query-result"}>To result</Link>
      <Button
        onClick={() => {
          // setY.start({ y: 500 });
          setY.start({
            y: queryResultRef.current?.getBoundingClientRect().top,
          });
        }}
      >
        Spring Effect
      </Button>
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
      {searchParams?.size ? (
        <section id="query-result" ref={queryResultRef} className="bg h-screen">
          <h1>Query Result</h1>
          <p>query exist</p>
        </section>
      ) : null}
    </>
  );
};

export default SevenSlotsSearchForm;
