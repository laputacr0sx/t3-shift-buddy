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

const sevenSlotsSearchFormSchema = z
  .object({
    shiftCode: z.string().regex(abbreviatedDutyNumber),
  })
  .array();

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
    defaultValues: [{ shiftCode: "0" }],
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
                  name={`${i}.shiftCode` as const}
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
                          <Input {...field} autoCapitalize="characters" />
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
      </form>
    </Form>
  );
}

export default SevenSlotsSearchForm;
