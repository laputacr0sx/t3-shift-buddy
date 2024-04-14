import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    useForm,
    useFieldArray,
    useWatch,
    type Control,
    type UseFieldArrayUpdate,
    type FieldArrayWithId,
    type UseFormReset
    // type SubmitHandler,
} from 'react-hook-form';

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '~/components/ui/popover';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from '~/components/ui/form';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from '~/components/ui/card';

import { cn } from '~/lib/utils';
import { ArrowRight, CalendarIcon, Minus, RotateCcw } from 'lucide-react';
import moment from 'moment';
import { getWeekNumberByDate } from '~/utils/helper';
import { useMemo } from 'react';
import { Label } from './ui/label';
import { Calendar } from './ui/exchangeCalendar';

const fieldArrayName = 'candidates' as const;

const dynamicFormSchema = z.object({
    responsibleDay: z.date(),
    [fieldArrayName]: z
        .object({
            staffID: z.string().length(6, '輸入錯誤'),
            staffName: z.string(),
            rowNumber: z.string().regex(/[ABC]\d{1,3}/, '請輸入正確行序'),
            assignedDuty: z
                .string()
                .regex(/((?:1|3|5|6)(?:[0-5])(?:\d))/, '101 or 102 or 601'),
            targetDuty: z
                .string()
                .regex(/((?:1|3|5|6)(?:[0-5])(?:\d))/, '101 or 102 or 601')
        })
        .array()
});

type DynamicFormData = z.infer<typeof dynamicFormSchema>;

type DisplayProps = {
    control: Control<DynamicFormData>;
    index: number;
};

const Display = ({ control, index }: DisplayProps) => {
    const data = useWatch({
        control,
        name: `${fieldArrayName}.${index}`
    });

    console.log(data);
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
    value: FieldArrayWithId<DynamicFormData, typeof fieldArrayName, 'id'>;
    reset: UseFormReset<DynamicFormData>;
};

const Edit = ({ update, index, control, value, reset }: EditProps) => {
    const dynamicForm = useForm<DynamicFormData>({});

    // const {
    //   handleSubmit: handleCandidateSubmit,
    //   setValue,
    //   getValues,
    // } = dynamicForm;

    // const onCandidateSubmit: SubmitHandler<DynamicFormData> = (data) => {
    //   console.log(data);
    // };

    return (
        <>
            <Display control={control} index={index} />
            <Card className="flex flex-col gap-2 border-x-0 border-y-0">
                <CardHeader>
                    <CardTitle>
                        {`${value.staffName}` || `Candidate ${index + 1}`}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <div className="flex justify-between gap-2">
                        <FormField
                            control={dynamicForm.control}
                            name={`candidates.${index}.staffID` as const}
                            render={({ field }) => (
                                <FormItem className="m-0">
                                    <FormLabel>職員號碼</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className={cn(
                                                'w-20 font-mono tracking-wide'
                                            )}
                                            placeholder="9999XX"
                                            maxLength={6}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={dynamicForm.control}
                            name={`candidates.${index}.staffName` as const}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>姓名</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-24 font-mono tracking-wide"
                                            {...field}
                                            type="text"
                                            placeholder="CHANTM"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={dynamicForm.control}
                            name={`candidates.${index}.rowNumber` as const}
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
                            control={dynamicForm.control}
                            name={`candidates.${index}.assignedDuty` as const}
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
                            control={dynamicForm.control}
                            name={`candidates.${index}.targetDuty` as const}
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
                        variant={'secondary'}
                        onClick={() => {
                            update(index, value);

                            // handleCandidateSubmit(onCandidateSubmit);
                        }}
                        className="px-4"
                    >
                        確定調更資料
                    </Button>
                    <Button
                        type="reset"
                        variant={'destructive'}
                        className="w-[102px]"
                        onClick={() => {
                            reset();
                        }}
                    >
                        重置
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
};

export default function DynamicDynamicForm() {
    const dynamicForm = useForm<DynamicFormData>({
        resolver: zodResolver(dynamicFormSchema),
        defaultValues: {
            responsibleDay: new Date(),
            [fieldArrayName]: [
                {
                    staffID: '',
                    staffName: '',
                    rowNumber: '',
                    assignedDuty: '',
                    targetDuty: ''
                },
                {
                    staffID: '',
                    staffName: '',
                    rowNumber: '',
                    assignedDuty: '',
                    targetDuty: ''
                }
            ]
        },
        mode: 'onBlur'
    });

    const { control, handleSubmit: handleFormSubmit, reset } = dynamicForm;

    const { fields, append, update, remove } = useFieldArray<DynamicFormData>({
        control,
        name: `${fieldArrayName}`
    });

    const weekNumberMemoized = useMemo(() => {
        return getWeekNumberByDate(
            dynamicForm.getValues(`responsibleDay`)
        ).toString();
    }, [dynamicForm, dynamicForm.watch('responsibleDay')]);

    const onSubmit = (values: DynamicFormData) => console.log(values);

    return (
        <div className="h-full w-fit px-4 py-4">
            <Form {...dynamicForm}>
                <form
                    onSubmit={handleFormSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <Card className="border-x-0 border-b-sky-900 border-t-sky-500">
                        <div className="flex justify-between pb-4">
                            <CardHeader>
                                <FormField
                                    control={dynamicForm.control}
                                    name={'responsibleDay' as const}
                                    render={({ field }) => {
                                        const value = field.value;
                                        return (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="text-xl">
                                                    目標日期
                                                </FormLabel>
                                                <section className="flex items-center justify-center">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={
                                                                        'outline'
                                                                    }
                                                                    className={cn(
                                                                        'w-fit pl-3 text-left font-normal',
                                                                        !value &&
                                                                        'text-muted-foreground'
                                                                    )}
                                                                >
                                                                    {value ? (
                                                                        // format(value, "dd-MM-yyyy E")
                                                                        moment(
                                                                            value
                                                                        ).format(
                                                                            'DD/MM/YYYY ddd'
                                                                        )
                                                                    ) : (
                                                                        <span>
                                                                            Pick
                                                                            a
                                                                            date
                                                                        </span>
                                                                    )}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent
                                                            className="w-auto p-0"
                                                            align="start"
                                                        >
                                                            <Calendar
                                                                mode="single"
                                                                selected={
                                                                    field.value
                                                                }
                                                                onSelect={
                                                                    field.onChange
                                                                }
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <Button
                                                        onClick={() => {
                                                            reset();
                                                        }}
                                                    >
                                                        <RotateCcw />
                                                    </Button>
                                                </section>
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
                        <CardContent className="flex w-fit flex-col gap-5">
                            {fields.map((field, index) => (
                                <fieldset
                                    key={field.id}
                                    className="flex flex-col items-center justify-center"
                                >
                                    <Card className="relative flex w-fit flex-col items-center justify-center gap-4 border-y-0 border-x-lime-500">
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
                                    </Card>
                                </fieldset>
                            ))}
                        </CardContent>
                        <div className="flex justify-around">
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={() => {
                                    append({
                                        staffID: '',
                                        staffName: '',
                                        rowNumber: '',
                                        assignedDuty: '',
                                        targetDuty: ''
                                    });
                                }}
                            >
                                添加
                            </Button>
                            <Button variant="secondary" type="submit" disabled>
                                生成調更紙
                            </Button>
                        </div>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
