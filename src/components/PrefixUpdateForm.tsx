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

import moment from "moment";
import { api } from "~/utils/api";
import { autoPrefix } from "~/utils/helper";
import { Label } from "./ui/label";
import { Minus, Plus } from "lucide-react";

const prefixFormSchema = z.object({
  weekNumber: z.number().min(1).max(52),
  weeks: z
    .object({
      alphabeticPrefix: z
        .string()
        .regex(/[a-z]/gi, "Only alphabetic characters allowed")
        .max(1),
      numericPrefix: z.string().regex(/(1[3|4|5]|7[1|5])/),
    })
    .array(),
});

type PrefixFormSchema = z.infer<typeof prefixFormSchema>;

type DynamicUpdatePrefixFormProps = {
  currentWeekNumber: number;
  dates: Date[];
  prefixDetails: {
    alphabeticPrefix: string;
    numericPrefix: string;
  }[];
};

function DynamicUpdatePrefixForm(props: DynamicUpdatePrefixFormProps) {
  const { currentWeekNumber, prefixDetails } = props;

  const prefixForm = useForm<PrefixFormSchema>({
    resolver: zodResolver(prefixFormSchema),
    defaultValues: {
      weekNumber: currentWeekNumber,
      weeks: prefixDetails,
    },
    values: {
      weekNumber: currentWeekNumber,
      weeks: prefixDetails,
    },
    mode: "onChange",
  });

  const { mutate: createPrefixes, isLoading: updatingPrefixes } =
    api.prefixController.createNextWeekPrefix.useMutation({
      onSuccess: async () => {
        await api
          .useContext()
          .prefixController.getPrefixGivenWeekNumber.invalidate({
            weekNumber: currentWeekNumber,
          });
      },
    });

  function prefixFormHandler(values: PrefixFormSchema) {
    const completePrefix = values.weeks.map(
      ({ alphabeticPrefix, numericPrefix }) =>
        `${alphabeticPrefix}${numericPrefix}`
    );

    console.log({
      weekNumber: currentWeekNumber,
      prefixes: completePrefix,
    });

    createPrefixes({
      weekNumber: values.weekNumber,
      prefixes: completePrefix,
    });
  }

  return (
    <Form {...prefixForm}>
      <form
        onSubmit={prefixForm.handleSubmit(prefixFormHandler)}
        className=" flex w-fit flex-col space-y-2"
      >
        <FormField
          key={props.dates.join()}
          control={prefixForm.control}
          name="weekNumber"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-4 font-mono">
                <FormLabel className="items-center justify-center">
                  更表期數
                </FormLabel>
                <FormControl>
                  <>
                    <Button
                      variant={"ghost"}
                      type="button"
                      onClick={() => {
                        return prefixForm.setValue(
                          "weekNumber",
                          field.value + 1,
                          {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          }
                        );
                      }}
                    >
                      <Plus />
                    </Button>
                    <Label>{field.value}</Label>
                    <Button
                      variant={"ghost"}
                      type="button"
                      onClick={() => {
                        return prefixForm.setValue(
                          "weekNumber",
                          field.value - 1,
                          {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          }
                        );
                      }}
                    >
                      <Minus />
                    </Button>
                  </>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {props.dates.map((date, i) => {
          const autoPrefixOnDate = autoPrefix()[i];
          return (
            <fieldset key={date.toISOString()}>
              <section className="flex items-center justify-center">
                <FormField
                  control={prefixForm.control}
                  name={`weeks.${i}.alphabeticPrefix` as const}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between gap-4 font-mono">
                        <FormLabel className="items-center">
                          {moment(date).format("D/MM ddd")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="w-10 border-r-0 text-center"
                            maxLength={1}
                            autoCapitalize="characters"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  key={date.toISOString()}
                  control={prefixForm.control}
                  name={`weeks.${i}.numericPrefix` as const}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between gap-4 font-mono">
                        <FormControl>
                          <Input
                            {...field}
                            className="w-12 border-l-0 text-center"
                            maxLength={2}
                            placeholder={autoPrefixOnDate?.prefix}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>
              <FormDescription>
                {autoPrefixOnDate?.racingDetails?.keyMatches}
                {autoPrefixOnDate?.holidayDetails?.summary}
              </FormDescription>
            </fieldset>
          );
        })}
        <Button
          type="submit"
          variant={"secondary"}
          disabled={updatingPrefixes}
          className="items-center justify-center self-center tracking-wider"
        >
          {`更改${prefixForm.getValues("weekNumber")}週時間表`}
        </Button>
      </form>
    </Form>
  );
}

export default DynamicUpdatePrefixForm;
