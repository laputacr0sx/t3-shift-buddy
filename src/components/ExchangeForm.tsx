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
import { getCurrentWeekNumber } from "~/utils/helper";
import { useUser } from "@clerk/nextjs";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { cn } from "~/lib/utils";
import { ArrowRight, Calendar as CalendarIcon, Info } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { api } from "~/utils/api";
import { Description } from "@radix-ui/react-toast";

// const staffExchangeFormSchema = z.object({
//   staffID: z.string(),
//   staffName: z.string(),
//   rowNumber: z.number(),
//   correspondingDate: z.date(),
//   assignedDuty: z.string(),
// });

const shiftsExchangeFormSchema = z.object({
  candidate1: z.object({
    staffID: z.string().max(6),
    staffName: z.string(),
    rowNumber: z.string(),
    correspondingDate: z.date(),
    assignedDuty: z.string().regex(/((?:1|3|5|6)(?:[0-5])(?:\d))/),
    targetDuty: z
      .string()
      .regex(/((?:1|3|5|6)(?:[0-5])(?:\d))/, "101 or 102 or 601"),
  }),
});

const weekNumber = getCurrentWeekNumber().toString();

export default function ExchangeForm() {
  const { user } = useUser();

  const exchangeForm = useForm<z.infer<typeof shiftsExchangeFormSchema>>({
    resolver: zodResolver(shiftsExchangeFormSchema),
    defaultValues: {
      candidate1: {
        staffID: user?.id,
        staffName: "",
        rowNumber: "",
        correspondingDate: new Date(),
        assignedDuty: "",
      },
    },
    mode: "onBlur",
  });

  function onSubmitForExchange(
    values: z.infer<typeof shiftsExchangeFormSchema>
  ) {
    console.log(values);
  }

  return (
    <Card className="h-fit">
      <div className="flex justify-start pb-4">
        <CardHeader>
          <CardTitle>Candidate 1</CardTitle>
        </CardHeader>
        <CardHeader>
          <CardTitle>週數：{weekNumber}</CardTitle>
        </CardHeader>
      </div>
      <CardContent>
        <Form {...exchangeForm}>
          <form
            onSubmit={exchangeForm.handleSubmit(onSubmitForExchange)}
            className="space-y-8"
          >
            <div className="flex justify-between gap-2">
              <FormField
                control={exchangeForm.control}
                name="candidate1.staffID"
                render={({ field }) => (
                  <FormItem className="m-0">
                    <FormLabel>職員號碼</FormLabel>
                    <FormControl>
                      <Input
                        className=" w-20 font-mono tracking-wide"
                        {...field}
                        placeholder="9999XX"
                        maxLength={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={exchangeForm.control}
                name="candidate1.staffName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      姓名
                      {/* <Info
                        size={14}
                        onClick={() => {
                          console.log("info clicked");
                        }}
                      /> */}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-24 font-mono tracking-wide"
                        {...field}
                        type="text"
                        placeholder="CHANTM"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={exchangeForm.control}
                name="candidate1.rowNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>編定輪次</FormLabel>
                    <FormControl>
                      <Input
                        className="w-16 font-mono tracking-wide"
                        {...field}
                        placeholder="A52"
                        maxLength={4}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col justify-start gap-2">
              <FormField
                control={exchangeForm.control}
                name="candidate1.correspondingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>想調邊日？</FormLabel>
                    {/* <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd-MM-yyyy E")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover> */}
                    <Input placeholder="testing" className="w-auto" />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center justify-between align-middle">
              <FormField
                control={exchangeForm.control}
                name="candidate1.assignedDuty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>原定更</FormLabel>
                    <FormControl>
                      <Input
                        className="w-24 font-mono tracking-wide"
                        {...field}
                        placeholder="J15101"
                        maxLength={7}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Label className="items-center justify-center align-middle text-3xl font-bold">
                <ArrowRight size={36} strokeWidth={3} />
              </Label>
              <FormField
                control={exchangeForm.control}
                name="candidate1.targetDuty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>目標更</FormLabel>
                    <FormControl>
                      <Input
                        className="w-24 font-mono tracking-wide"
                        {...field}
                        placeholder="J15101"
                        maxLength={7}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="submit" variant={"secondary"} disabled className="px-4">
          生成調更表
        </Button>
        <Button
          type="reset"
          variant={"destructive"}
          className="w-[102px]"
          onClick={() => {
            exchangeForm.reset({ candidate1: {} });
          }}
        >
          重置
        </Button>
      </CardFooter>
    </Card>
  );
}
