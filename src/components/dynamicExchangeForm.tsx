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
  UseFormReset,
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

const fieldArrayName = "date@Ecchange";

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
      <h3>Submitted Data</h3>
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
  value: FieldArrayWithId<DynamicFormData, "date@Ecchange", "id">;
  reset: UseFormReset<DynamicFormData>;
};

const Edit = ({ update, index, control, value, reset }: EditProps) => {
  const dynamicForm = useForm<DynamicFormData>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: { [fieldArrayName]: [] },
    mode: "onChange",
  });

  const { handleSubmit: handleCandidateSubmit, setValue } = dynamicForm;

  return (
    <div className="h-fit w-screen px-2">
      <Display control={control} index={index} />
      <Card className="flex flex-col gap-2">
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
            type="reset"
            variant={"destructive"}
            className="w-[102px]"
            onClick={() => {
              reset({ [fieldArrayName]: [] });
            }}
          >
            重置
          </Button>
        </CardFooter>
      </Card>
      <Button
        variant={"secondary"}
        onClick={handleCandidateSubmit((data) => {
          const [correspondingData] = data[fieldArrayName];

          if (!correspondingData) return;
          // setValue(`${fieldArrayName}.${index}`, value);
          console.log(correspondingData);
          update(index, correspondingData);
        })}
      >
        確定
      </Button>
    </div>
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
    <div className="h-full">
      <Form {...dynamicForm}>
        <form onSubmit={handleFormSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <fieldset
              key={field.id}
              className="flex flex-col items-center justify-center gap-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    {field.name || `Candidate ${index + 1}`}
                  </CardTitle>
                </CardHeader>
                <Edit
                  control={control}
                  update={update}
                  index={index}
                  value={field}
                  reset={reset}
                />
                <Button
                  className="w-fit"
                  variant={"destructive"}
                  type="button"
                  onClick={() => remove(index)}
                >
                  移除
                </Button>
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
