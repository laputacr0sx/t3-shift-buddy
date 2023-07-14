"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import { useForm } from "react-hook-form";

import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { DatePickerWithRange } from "./ui/DatePickerWithRange";
import { Separator } from "./ui/separator";

const dayOffFormSchema = z.object({
  preferredOffType: z.enum(["ANY", "AL", "GH", "CL"], {
    required_error: "Please select one of the day off type.",
  }),
  date: z.date(),
});

export default function RegisterDayOffForm() {
  // 1. Define your form.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dayOffForm = useForm<z.infer<typeof dayOffFormSchema>>({
    resolver: zodResolver(dayOffFormSchema),
    defaultValues: {
      preferredOffType: "ANY",
      date: new Date(),
    },
  });
  // 2. Define a submit handler.
  function dayOffFormHandler(values: z.infer<typeof dayOffFormSchema>) {
    return { ...values };
  }

  return (
    <Form {...dayOffForm}>
      <form
        onSubmit={dayOffForm.handleSubmit(dayOffFormHandler)}
        className="space-y-8"
      >
        <FormField
          control={dayOffForm.control}
          name="preferredOffType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>假期類別</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4 "
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ANY" />
                    </FormControl>
                    <FormLabel className="font-mono">任擇</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="AL" />
                    </FormControl>
                    <FormLabel className="font-mono">AL</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="GH" />
                    </FormControl>
                    <FormLabel className="font-mono">GH</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="CL" />
                    </FormControl>
                    <FormLabel className="font-mono">CL</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <Separator className={"my-4"} />
              <FormLabel>日期</FormLabel>
              <FormControl>
                <DatePickerWithRange />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant={"secondary"}>
          預覽
        </Button>
      </form>
    </Form>
  );
}
