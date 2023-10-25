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
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";

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
    assignedDuty: z.string(),
  }),
});

const weekNumber = getCurrentWeekNumber().toString();

export default function ExchangeForm() {
  const { user } = useUser();

  const exchangeForm = useForm<z.infer<typeof shiftsExchangeFormSchema>>({
    resolver: zodResolver(shiftsExchangeFormSchema),
    defaultValues: {
      candidate1: {
        staffID: "",
        staffName: "",
        rowNumber: "",
        correspondingDate: new Date(),
        assignedDuty: "",
      },
    },
  });

  async function onSubmitForExchange(
    values: z.infer<typeof shiftsExchangeFormSchema>
  ) {
    //
  }

  return (
    <Card className="h-fit">
      <div className="flex justify-between">
        <CardHeader className="pb-1">
          <CardTitle>Candidate 1</CardTitle>
        </CardHeader>
        <CardHeader className="pb-1">
          <CardTitle>週數：{weekNumber}</CardTitle>
        </CardHeader>
      </div>
      <CardContent>
        <Form {...exchangeForm}>
          <form
            onSubmit={exchangeForm.handleSubmit(onSubmitForExchange)}
            className="space-y-8"
          >
            <div className="flex justify-between gap-4">
              <FormField
                control={exchangeForm.control}
                name="candidate1.staffID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>職員號碼</FormLabel>
                    <FormControl>
                      <Input
                        className="w-20 font-mono tracking-wide"
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
                    <FormLabel>姓名</FormLabel>
                    <FormControl>
                      <Input
                        className="w-24 font-mono tracking-wide"
                        {...field}
                        placeholder="CHANTM for CHAN TAI MAN"
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
                        className="w-14 font-mono tracking-wide"
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
            <div>
              <FormField
                control={exchangeForm.control}
                name="candidate1.correspondingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>想調邊日？</FormLabel>
                    <Popover>
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
                              format(field.value, "dd/MM/yyyy EEEE")
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="flex justify-center gap-8">
          <Button type="submit" variant={"secondary"} disabled>
            生成調更表
          </Button>
          <Button
            type="reset"
            variant={"destructive"}
            onClick={() => {
              exchangeForm.reset({ candidate1: {} });
            }}
          >
            重置
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
