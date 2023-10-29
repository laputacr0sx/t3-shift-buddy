import * as React from "react";
import {
  useForm,
  useFieldArray,
  useWatch,
  type Control,
  type UseFieldArrayUpdate,
  type FieldArrayWithId,
} from "react-hook-form";

import { z } from "zod";

const dynamicShiftsExchangeFormSchema = z.object({
  candidate: z
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

type DynamicShiftsExchangeFormData = z.infer<
  typeof dynamicShiftsExchangeFormSchema
>;

const fieldArrayName = "candidate";

type DisplayProps = {
  control: Control<DynamicShiftsExchangeFormData>;
  index: number;
};

const Display = ({ control, index }: DisplayProps) => {
  const data = useWatch({
    control,
    name: `${fieldArrayName}.${index}`,
  });

  if (!data) return null;

  return (
    <div>
      <h3>Submitted Data</h3>
      <p>{data.staffName}</p>
      <p>{data.staffID}</p>
    </div>
  );
};

type EditProps = {
  control: Control<DynamicShiftsExchangeFormData>;
  index: number;
  update: UseFieldArrayUpdate<DynamicShiftsExchangeFormData>;
  value: FieldArrayWithId<
    {
      candidate: {
        staffID: string;
        staffName: string;
        rowNumber: string;
        correspondingDate: Date;
        assignedDuty: string;
        targetDuty: string;
      }[];
    },
    "candidate",
    "id"
  >;
};

const Edit = ({ update, index, control, value }: EditProps) => {
  const { register, handleSubmit, setValue } =
    useForm<DynamicShiftsExchangeFormData>({
      defaultValues: {
        candidate: [
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

  return (
    <div>
      <Display control={control} index={index} />

      <input
        placeholder="staffName"
        {...register(`candidate.${index}.staffName`, { required: true })}
      />
      <input
        placeholder="staff id"
        {...register(`candidate.${index}.staffID`, { required: true })}
      />

      <button
        type="button"
        onClick={handleSubmit(({ candidate }) => {
          if (!candidate) return;
          // setValue(`${fieldArrayName}.${index}`, value);
          update(index, value);
        })}
      >
        Submit
      </button>
    </div>
  );
};

export default function DynamicExchangeForm() {
  const { control, handleSubmit } = useForm<DynamicShiftsExchangeFormData>();
  const { fields, append, update, remove } =
    useFieldArray<DynamicShiftsExchangeFormData>({
      control,
      name: `${fieldArrayName}`,
    });
  const onSubmit = (values: DynamicShiftsExchangeFormData) =>
    console.log(values);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <fieldset key={field.id}>
            <Edit
              control={control}
              update={update}
              index={index}
              value={field}
            />
            <button
              className="remove"
              type="button"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </fieldset>
        ))}

        <br />

        <button
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
          append
        </button>
        <input type="submit" />
      </form>
    </div>
  );
}
