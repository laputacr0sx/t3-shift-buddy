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

import { shiftRowRegex } from "~/utils/regex";

const rowFormSchema = z.object({
  shiftRow: z.string().regex(shiftRowRegex, "輸入更號不正確"),
});

export default function SearchShiftForm() {
  const rowForm = useForm<z.infer<typeof rowFormSchema>>({
    resolver: zodResolver(rowFormSchema),
    defaultValues: {
      shiftRow: "",
    },
  });

  async function onSubmitForRow(values: z.infer<typeof rowFormSchema>) {
    await router.push(`/wholeweek/${values.shiftRow}`);
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>下週番號</FormLabel>
                <FormControl>
                  <Input
                    className="font-mono tracking-wide"
                    placeholder="101102103104105106RD"
                    onFocus={() => {
                      console.log(
                        "input focused, custom keyboard should come up"
                      );
                    }}
                    {...field}
                  />
                </FormControl>
                <FormDescription className=" break-words font-mono tracking-wide">
                  如更份為
                  <br />
                  F15101
                  <br />
                  F15102
                  <br />
                  C14103
                  <br />
                  F15104
                  <br />
                  F15105
                  <br />
                  B75106
                  <br />
                  RD
                  <br />
                  請輸入 101102103104105106RD
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant={"secondary"}>
            查下週更資料
          </Button>
        </form>
      </Form>
    </>
  );
}
