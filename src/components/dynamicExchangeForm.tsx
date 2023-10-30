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
    })
    .array(),
});

type dynamicFormData = z.infer<typeof dynamicFormSchema>;

type DisplayProps = {
  control: Control<dynamicFormData>;
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
        {data?.name} {data?.age}
      </p>
    </div>
  );
};

type EditProps = {
  control: Control<dynamicFormData>;
  index: number;
  update: UseFieldArrayUpdate<dynamicFormData>;
  value: FieldArrayWithId<dynamicFormData, "date@Ecchange", "id">;
  // value: FieldArray<dynamicFormData, "candidate">;
};

const Edit = ({ update, index, control, value }: EditProps) => {
  const dynamicForm = useForm<dynamicFormData>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: { [fieldArrayName]: [] },
    mode: "onBlur",
  });

  const { handleSubmit: handleCandidateSubmit, setValue } = dynamicForm;

  return (
    <Card className="h-fit px-2">
      <Display control={control} index={index} />
      <Card className="flex flex-col gap-2">
        <CardContent className="flex flex-col gap-2">
          <div className="flex justify-around gap-2">
            <FormField
              control={control}
              name={`${fieldArrayName}.${index}.name` as const}
              render={({ field }) => {
                // console.log(`${fieldArrayName}.${index}.name `);
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
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="reset"
            variant={"destructive"}
            className="w-[102px]"
            onClick={() => {
              dynamicForm.reset({ [fieldArrayName]: [] });
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
    </Card>
  );
};

export default function DynamicDynamicForm() {
  const dynamicForm = useForm<dynamicFormData>({
    defaultValues: {
      [fieldArrayName]: [
        {
          name: "",
          age: undefined,
        },
        {
          name: "",
          age: undefined,
        },
      ],
    },
  });

  const { control, handleSubmit: handleFormSubmit } = dynamicForm;

  const { fields, append, update, remove } = useFieldArray<dynamicFormData>({
    control,
    name: `${fieldArrayName}`,
  });
  const onSubmit = (values: dynamicFormData) => console.log(values);

  return (
    <Card>
      <Form {...dynamicForm}>
        <form onSubmit={handleFormSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <fieldset
              key={field.id}
              className="flex flex-col items-center justify-center"
            >
              <CardHeader>
                <CardTitle>{field.name || `Candidate ${index + 1}`}</CardTitle>
              </CardHeader>
              <Edit
                control={control}
                update={update}
                index={index}
                value={field}
              />
              <Button
                className="w-fit"
                variant={"destructive"}
                type="button"
                onClick={() => remove(index)}
              >
                移除
              </Button>
            </fieldset>
          ))}

          <div className="flex justify-around">
            <Button
              variant={"outline"}
              type="button"
              onClick={() => {
                append({ name: "", age: 0 });
              }}
            >
              添加
            </Button>
            <Button variant="outline" type="submit">
              確定調更
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
