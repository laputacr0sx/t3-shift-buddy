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

import { shiftRowRegex } from "~/utils/regex";

const rowFormSchema = z.object({
  shiftRow: z.string().regex(shiftRowRegex, "輸入更號不正確"),
});

export default function ExchangeForm() {
  const rowForm = useForm<z.infer<typeof rowFormSchema>>({
    resolver: zodResolver(rowFormSchema),
    defaultValues: {
      shiftRow: "",
    },
  });

  async function onSubmitForRow(values: z.infer<typeof rowFormSchema>) {
    //
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
                  Exchange
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center gap-8">
            <Button type="submit">查下週更資料</Button>
            <Button
              type="reset"
              variant={"destructive"}
              onClick={() => {
                rowForm.reset();
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
