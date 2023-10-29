import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import moment from "moment";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { getCurrentWeekNumber } from "~/utils/helper";
import { cn } from "~/lib/utils";
import { ArrowRight, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";

export const shiftsExchangeFormSchema = z.object({
  candidate1: z.object({
    staffID: z.string().length(6, "輸入錯誤"),
    staffName: z.string(),
    rowNumber: z.string().regex(/[ABC]\d{1,3}/, "請輸入正確行序"),
    correspondingDate: z.date(),
    assignedDuty: z
      .string()
      .regex(/((?:1|3|5|6)(?:[0-5])(?:\d))/, "101 or 102 or 601"),
    targetDuty: z
      .string()
      .regex(/((?:1|3|5|6)(?:[0-5])(?:\d))/, "101 or 102 or 601"),
  }),
});

type ShiftsExchangeFormData = z.infer<typeof shiftsExchangeFormSchema>;

export default function ExchangeForm() {
  const exchangeForm = useForm<ShiftsExchangeFormData>({
    resolver: zodResolver(shiftsExchangeFormSchema),
    defaultValues: {
      candidate1: {
        staffID: "",
        staffName: "",
        rowNumber: "",
        correspondingDate: new Date(),
        assignedDuty: "",
        targetDuty: "",
      },
    },
    mode: "onBlur",
  });

  const weekNumberMemoized = useMemo(() => {
    return getCurrentWeekNumber(
      exchangeForm.getValues("candidate1.correspondingDate")
    ).toString();
  }, [exchangeForm, exchangeForm.watch("candidate1.correspondingDate")]);

  function onSubmitForExchange(values: ShiftsExchangeFormData) {
    console.log(values);
  }

  return (
    <Form {...exchangeForm}>
      <form
        onSubmit={exchangeForm.handleSubmit(onSubmitForExchange)}
        className="space-y-8"
      >
        <Card className="h-fit">
          <div className="flex justify-between pb-4">
            <CardHeader>
              <FormField
                control={exchangeForm.control}
                name="candidate1.correspondingDate"
                render={({ field }) => {
                  const value = field.value;
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-xl">目標日期</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-fit pl-3 text-left font-normal",
                                !value && "text-muted-foreground"
                              )}
                            >
                              {value ? (
                                // format(value, "dd-MM-yyyy E")
                                moment(value).format("DD/MM/YYYY ddd")
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
                      </Popover>
                    </FormItem>
                  );
                }}
              />
            </CardHeader>
            <CardHeader className="justify-between text-center">
              <CardTitle>
                <Label className="text-xl">
                  週數
                  <br />
                  {weekNumberMemoized}
                </Label>
              </CardTitle>
            </CardHeader>
          </div>
          <Card className="flex flex-col gap-2">
            <CardHeader>
              <CardTitle>Candidate 1</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex justify-between gap-2">
                <FormField
                  control={exchangeForm.control}
                  name="candidate1.staffID"
                  render={({ field }) => (
                    <FormItem className="m-0">
                      <FormLabel>職員號碼</FormLabel>
                      <FormControl>
                        <Input
                          className={cn("w-20 font-mono tracking-wide")}
                          {...field}
                          placeholder="9999XX"
                          maxLength={6}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={exchangeForm.control}
                  name="candidate1.staffName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>姓名</FormLabel>
                      <FormControl>
                        <Input
                          className="w-24 font-mono tracking-wide"
                          {...field}
                          type="text"
                          placeholder="CHANTM"
                          disabled
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={exchangeForm.control}
                  name="candidate1.rowNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>編定行序</FormLabel>
                      <FormControl>
                        <Input
                          className="w-16 font-mono tracking-wide"
                          {...field}
                          placeholder="A52"
                          maxLength={4}
                        />
                      </FormControl>
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
                          className="w-14 font-mono tracking-wide"
                          {...field}
                          placeholder="101"
                          maxLength={3}
                        />
                      </FormControl>
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
                          className="w-14 font-mono tracking-wide"
                          {...field}
                          placeholder="159"
                          maxLength={3}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="submit"
                variant={"secondary"}
                disabled
                className="px-4"
              >
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
        </Card>
      </form>
    </Form>
  );
}
