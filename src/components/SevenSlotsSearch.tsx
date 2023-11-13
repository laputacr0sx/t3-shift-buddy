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

import moment from "moment";
import { autoPrefix } from "~/utils/helper";
import { shiftNameRegex } from "~/utils/regex";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

const dayDetailName = `Y${moment().year()}W${moment().week()}`;

const sevenSlotsSearchFormSchema = z.object({
  [dayDetailName]: z
    .object({
      shiftCode: z
        .string()
        .regex(shiftNameRegex, "不正確輸入")
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
      console.log("formData", data);
      console.log(
        "validation result",
        await zodResolver(sevenSlotsSearchFormSchema)(data, context, options)
      );
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

  const prefixFormHandler: SubmitHandler<sevenSlotsSearchForm> = (data) => {
    console.log(data);
    return;
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
          {/* <Label>DayOff</Label> */}
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
