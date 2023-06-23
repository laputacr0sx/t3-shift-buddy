"use client";

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
import { prefixRegex } from "~/lib/regex";
import { type WeekPrefix } from "@prisma/client";

const prefixFormSchema = z.object({
  MON: z.string().regex(prefixRegex),
  TUE: z.string().regex(prefixRegex),
  WED: z.string().regex(prefixRegex),
  THU: z.string().regex(prefixRegex),
  FRI: z.string().regex(prefixRegex),
  SAT: z.string().regex(prefixRegex),
  SUN: z.string().regex(prefixRegex),
});

interface PropsType {
  dates: Date[];
  prefixes?: WeekPrefix[];
}

export default function prefixForm(props: PropsType) {
  // 1. Define your form.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const prefixForm = useForm<z.infer<typeof prefixFormSchema>>({
    resolver: zodResolver(prefixFormSchema),
    defaultValues: {
      MON: "",
      TUE: "",
      WED: "",
      THU: "",
      FRI: "",
      SAT: "",
      SUN: "",
    },
  });
  // 2. Define a submit handler.
  function prefixFormHandler(values: z.infer<typeof prefixFormSchema>) {
    return { ...values };
  }

  return (
    <Form {...prefixForm}>
      <form
        onSubmit={prefixForm.handleSubmit(prefixFormHandler)}
        className="space-y-8"
      >
        <FormField
          control={prefixForm.control}
          name="MON"
          render={({ field, fieldState }) => (
            <FormItem>
              {props &&
                props.dates.map((date) => (
                  <FormLabel key={date.toISOString()}>
                    {date.getDay()}
                  </FormLabel>
                ))}
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>{fieldState.error?.message}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant={"secondary"}>
          去吧！
        </Button>
      </form>
    </Form>
  );
}
