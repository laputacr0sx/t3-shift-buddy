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
import router from "next/router";

import { shiftNameRegex, shiftRowRegex } from "~/utils/regex";
import { rawShiftArraySchema } from "~/utils/customTypes";
import { autoPrefix, getNextWeekDates } from "~/utils/helper";
import moment from "moment";

import { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import TouchPad from "./ui/touch-pad";

const rowFormSchema = z.object({
  shiftRow: z.string().regex(shiftRowRegex, "輸入更號不正確"),
});

export default function SearchShiftForm() {
  const [nextWeekDates, setnextWeekDates] = useState<
    ReturnType<typeof getNextWeekDates>
  >([]);
  const [timetable, setTimetable] = useState<ReturnType<typeof autoPrefix>>([]);
  const [parent] = useAutoAnimate(/* optional config */);

  useEffect(() => {
    setTimetable(autoPrefix());
    setnextWeekDates(getNextWeekDates());
  }, []);

  const formattedDates = timetable.map(({ date }) =>
    moment(date, "YYYYMMDD ddd").format("DD/MM（dd）")
  );

  const rowForm = useForm<z.infer<typeof rowFormSchema>>({
    resolver: zodResolver(rowFormSchema),
    defaultValues: {
      shiftRow: "",
    },
    mode: "onBlur",
  });

  async function onSubmitForRow(values: z.infer<typeof rowFormSchema>) {
    await router.push(`wholeweek/${values.shiftRow}`);
  }

  return (
    <>
      <Form {...rowForm}>
        <form
          onSubmit={rowForm.handleSubmit(onSubmitForRow)}
          className="space-y-8"
        >
          <FormField
            control={rowForm.control}
            name="shiftRow"
            render={({ field }) => {
              const values: unknown =
                field.value.length > 0 && field.value.match(shiftNameRegex);
              const validatedRawShiftArray =
                rawShiftArraySchema.safeParse(values);

              return (
                <FormItem>
                  <FormLabel>整週番號</FormLabel>
                  <FormControl>
                    <Input
                      className="font-mono tracking-wide"
                      placeholder="101102103104105106RD"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="gap-4" ref={parent}>
                    {formattedDates.map((date, i) => {
                      return (
                        <p key={date} className="py-1 font-mono tracking-wide">
                          {date} _{timetable[i]?.prefix}
                          {(validatedRawShiftArray.success &&
                            validatedRawShiftArray.data[i]) ||
                            "___"}
                          {timetable[i]?.holidayDetails?.summary}{" "}
                          {timetable[i]?.racingDetails?.venue}
                        </p>
                      );
                    })}
                  </FormDescription>
                  <FormDescription className="gap-4" ref={parent}>
                    {timetable.map((day, i) => {
                      const formatedDate = moment(
                        day.date,
                        "YYYYMMDD ddd"
                      ).format("DD/MM（dd）");
                      return (
                        <p
                          key={day.date}
                          className="py-1 font-mono tracking-wide"
                        >
                          {formatedDate} _{day.prefix}
                          {(validatedRawShiftArray.success &&
                            validatedRawShiftArray.data[i]) ||
                            "___"}
                          {day.holidayDetails?.summary}{" "}
                          {day.racingDetails?.venue}
                        </p>
                      );
                    })}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <TouchPad rowForm={rowForm} />
          <div className="flex justify-center gap-8">
            <Button type="submit" variant={"outline"}>
              查下週更資料
            </Button>
            <Button
              type="reset"
              variant={"destructive"}
              onClick={() => {
                rowForm.reset({ shiftRow: "" });
              }}
            >
              重置
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
