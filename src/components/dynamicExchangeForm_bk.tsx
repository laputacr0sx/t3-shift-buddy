import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useForm,
  useFieldArray,
  useWatch,
  type Control,
  type UseFieldArrayUpdate,
  type FieldArrayWithId,
  type UseFormReset,
  type SubmitHandler,
} from "react-hook-form";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { cn } from "~/lib/utils";
import { Minus } from "lucide-react";
import moment from "moment";

const correspondingDate = moment(new Date()).toString();

// const fieldArrayName = "date@Exchange" as const;
const fieldArrayName = correspondingDate;
console.log(correspondingDate);

const dynamicFormSchema = z.object({
  [fieldArrayName]: z
    .object({
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
    })
    .array(),
});

type DynamicFormData = z.infer<typeof dynamicFormSchema>;

type DisplayProps = {
  control: Control<DynamicFormData>;
  index: number;
};

const Display = ({ control, index }: DisplayProps) => {
  const data = useWatch({
    control,
    name: `${fieldArrayName}.${index}`,
  });

  if (!data.staffID) return null;

  return (
    <div>
      <p>
        {data?.staffName} {data?.staffID}
      </p>
    </div>
  );
};

type EditProps = {
  control: Control<DynamicFormData>;
  index: number;
  update: UseFieldArrayUpdate<DynamicFormData>;
  value: FieldArrayWithId<DynamicFormData, typeof fieldArrayName, "id">;
  reset: UseFormReset<DynamicFormData>;
};

const Edit = ({ index, control, reset }: EditProps) => {
  const dynamicForm = useForm<DynamicFormData>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: { [fieldArrayName]: [] },
    mode: "onChange",
  });

  const {
    handleSubmit: handleCandidateSubmit,

    getValues,
  } = dynamicForm;

  const onCandidateSubmit: SubmitHandler<DynamicFormData> = (data) => {
    console.log(data);
  };

  return (
    <>
      {/* <div className="h-fit w-screen px-2"> */}
      <Display control={control} index={index} />
      <Card className="flex flex-col gap-2 border-y-0 border-x-sky-500">
        <CardContent className="flex flex-col gap-2">
          <section className="flex justify-around gap-2">
            <FormField
              control={control}
              name={`${fieldArrayName}.${index}.name` as const}
              render={({ field }) => {
                return (
                  <FormItem className="m-0">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        className={cn("w-20 font-mono tracking-wide")}
                        {...field}
                        placeholder="NGSH"
                        maxLength={6}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <FormField
              control={control}
              name={`${fieldArrayName}.${index}.age` as const}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Testing</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className={cn("w-20 font-mono tracking-wide")}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </section>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant={"secondary"}
            onClick={
              handleCandidateSubmit(onCandidateSubmit)
              //   handleCandidateSubmit((data) => {
              //   const [correspondingData] = data[fieldArrayName];

              //   if (!correspondingData) return;
              //   // setValue(`${fieldArrayName}.${index}`, value);
              //   console.log(correspondingData);
              //   update(index, correspondingData);
              // })
            }
          >
            確定資料
          </Button>
          <Button
            type="reset"
            variant={"destructive"}
            className="w-[102px]"
            onClick={() => {
              // reset({ [fieldArrayName]: [] });
              reset({ ...getValues() });
            }}
          >
            重置
          </Button>
        </CardFooter>
      </Card>
      {/* </div> */}
    </>
  );
};

export default function DynamicDynamicForm() {
  const dynamicForm = useForm<DynamicFormData>({
    defaultValues: {
      [fieldArrayName]: [
        {
          staffID: "",
          staffName: "",
          rowNumber: "",
          correspondingDate: new Date(),
          assignedDuty: "",
          targetDuty: "",
        },
        {
          staffID: "",
          staffName: "",
          rowNumber: "",
          correspondingDate: new Date(),
          assignedDuty: "",
          targetDuty: "",
        },
      ],
    },
  });

  const { control, handleSubmit: handleFormSubmit, reset } = dynamicForm;

  const { fields, append, update, remove } = useFieldArray<DynamicFormData>({
    control,
    name: `${fieldArrayName}`,
  });
  const onSubmit = (values: DynamicFormData) => console.log(values);

  return (
    <div className="h-full w-fit px-4 py-4">
      <Form {...dynamicForm}>
        <form
          onSubmit={handleFormSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {fields.map((field, index) => (
            <fieldset
              key={field.id}
              className="flex flex-col items-center justify-center"
            >
              <Card className="relative flex w-screen flex-col items-center justify-center border-x-0 border-y-rose-500">
                <CardHeader>
                  <CardTitle>
                    {field.staffName || `Candidate ${index + 1}`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="w-screen">
                  <Edit
                    control={control}
                    update={update}
                    index={index}
                    value={field}
                    reset={reset}
                  />
                  <Button
                    className="absolute right-2 top-2 w-12"
                    size="sm"
                    variant="ghost"
                    onClick={() => remove(index)}
                  >
                    <Minus size={12} strokeWidth={12} />
                  </Button>
                </CardContent>
              </Card>
            </fieldset>
          ))}
          <div className="flex justify-around">
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                append({
                  staffID: "",
                  staffName: "",
                  rowNumber: "",
                  correspondingDate: new Date(),
                  assignedDuty: "",
                  targetDuty: "",
                });
              }}
            >
              添加
            </Button>
            <Button variant="secondary" type="submit">
              確定生成調更紙
            </Button>
          </div>
        </form>
        {/* <DevTool control={control} /> */}
      </Form>
    </div>
  );
}
