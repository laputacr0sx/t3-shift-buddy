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
import { useForm } from "react-hook-form";

import moment from "moment";
import { autoPrefix } from "~/utils/helper";
import { abbreviatedDutyNumber } from "~/utils/regex";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Toggle } from "./ui/toggle";
import { Switch } from "./ui/switch";

const dayDetailName = `Y${moment().year()}W${moment().week()}`;
console.log(dayDetailName);

const sevenSlotsSearchFormSchema = z.object({
  [dayDetailName]: z
    .object({
      shiftCode: z
        .string()
        .min(3)
        .max(7, "最長更名不多於7個字，例991106a / 881101a")
        .regex(abbreviatedDutyNumber, "不正確輸入"),
    })
    .array(),
});

type sevenSlotsSearchForm = z.infer<typeof sevenSlotsSearchFormSchema>;

function SevenSlotsSearchForm() {
  const [autoDayDetail, setAutoDayDetail] = useState<
    ReturnType<typeof autoPrefix>
  >([]);

  useEffect(() => {
    setAutoDayDetail(autoPrefix());
  }, []);

  const sevenSlotsSearchForm = useForm<sevenSlotsSearchForm>({
    resolver: zodResolver(sevenSlotsSearchFormSchema),
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
    mode: "onChange",
  });

  function prefixFormHandler(values: sevenSlotsSearchForm) {
    return;
  }

  return (
    <Form {...sevenSlotsSearchForm}>
      <form
        onSubmit={sevenSlotsSearchForm.handleSubmit(prefixFormHandler)}
        className=" flex w-fit flex-col space-y-2"
      >
        {autoDayDetail.map((day, i) => {
          return (
            <fieldset key={day.date}>
              <section className="flex items-center justify-center">
                <FormField
                  control={sevenSlotsSearchForm.control}
                  name={`${dayDetailName}[${i}].shiftCode`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between gap-4 font-mono">
                        <FormLabel className="items-center">
                          {moment(day.date, "YYYYMMDD ddd").format(
                            "DD/MM（dd）"
                          )}
                          {autoDayDetail[i]?.prefix}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="101"
                            autoCapitalize="characters"
                          />
                        </FormControl>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
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
}

export default SevenSlotsSearchForm;
