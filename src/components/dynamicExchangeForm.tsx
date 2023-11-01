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

const fieldArrayName = "date@Exchange" as const;

const dynamicFormSchema = z.object({
  [fieldArrayName]: z
    .object({
      name: z.string().length(3),
      age: z.number().min(18).max(100),
      rowNumber: z.string().regex(/[ABC]\d{3}/gim),
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

  if (!data.name) return null;

  return (
    <div>
      <p>
        {data?.name} {data?.age !== 0 ?? ""}
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

const Edit = ({ update, index, control, value, reset }: EditProps) => {
  const dynamicForm = useForm<DynamicFormData>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: { [fieldArrayName]: [] },
    mode: "onChange",
  });

  const {
    handleSubmit: handleCandidateSubmit,
    setValue,
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
          name: "",
          age: 0,
          rowNumber: "",
        },
        {
          name: "",
          age: 0,
          rowNumber: "",
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
                    {field.name || `Candidate ${index + 1}`}
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
                    size={"sm"}
                    className="absolute right-4 top-0 p-0"
                    variant={"destructive"}
                    type="button"
                    onClick={() => remove(index)}
                  >
                    <Minus size={8} strokeWidth={8} />
                  </Button>
                </CardContent>
              </Card>
            </fieldset>
          ))}

          <div className="flex justify-around">
            <Button
              variant={"secondary"}
              type="button"
              onClick={() => {
                append({ name: "", age: 0, rowNumber: "" });
              }}
            >
              添加
            </Button>
            <Button variant="secondary" type="submit">
              確定調更
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
