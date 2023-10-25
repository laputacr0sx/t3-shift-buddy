import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const staffExchangeFormSchema = z.object({
  staffID: z.string(),
  staffName: z.string(),
  rowNumber: z.number(),
  correspondingDate: z.date(),
  assignedDuty: z.string(),
});

export default function ExchangeForm() {
  const rowForm = useForm<z.infer<typeof staffExchangeFormSchema>>({
    resolver: zodResolver(staffExchangeFormSchema),
    defaultValues: {
      staffID: "",
    },
  });

  async function onSubmitForExchange(
    values: z.infer<typeof staffExchangeFormSchema>
  ) {
    //
  }

  return (
    <>
      <Form {...rowForm}>
        <form
          onSubmit={rowForm.handleSubmit(onSubmitForExchange)}
          className="space-y-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Candidate 1</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between gap-4">
                <FormField
                  control={rowForm.control}
                  name="staffID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>STAFF ID</FormLabel>
                      <FormControl>
                        <Input
                          className="w-24 font-mono tracking-wide"
                          {...field}
                        />
                      </FormControl>
                      {/* <FormDescription className=" break-words font-mono tracking-wide">
                  Exchange
                </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={rowForm.control}
                  name="staffName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>STAFF NAME</FormLabel>
                      <FormControl>
                        <Input className="font-mono tracking-wide" {...field} />
                      </FormControl>
                      {/* <FormDescription className=" break-words font-mono tracking-wide">
                  Exchange
                </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-center gap-8">
                <Button type="submit" variant={"secondary"}>
                  生成調更表
                </Button>
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
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
