import { zodResolver } from '@hookform/resolvers/zod';
import {
    UseFieldArrayRemove,
    useFieldArray,
    useForm,
    useWatch,
    type Control,
    type FieldArrayWithId,
    type FieldErrors,
    type UseFieldArrayUpdate
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { api } from '~/utils/api';
import { DayDetail } from '~/utils/customTypes';
import { DefaultData } from '../SevenSlotsSearchForm';
import IconIconPlusCircle from '../svgIcons/CirclePlus';

import { format } from 'date-fns';
import { CalendarIcon, Minus } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Card, CardContent, CardFooter, CardTitle } from '../ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const FIELD_ARRAY_NAME = 'exchange';

const bestExchangeFormSchema = z.object({
    [FIELD_ARRAY_NAME]: z.object({
        info: z.object({
            date: z.date({ required_error: 'A date of birth is required.' }),
            sequenceId: z.string()
        }),
        swappers: z
            .object({
                staffName: z.string().min(1),
                staffId: z.string().length(6),
                rowId: z
                    .string()
                    .regex(/[ABCS]\d{1,3}/gim, 'Wrong format of ROW ID'),
                currentDuty: z.string(),
                targetDuty: z.string()
            })
            .array()
    })
});
export type BestExchangeFormSchema = z.infer<typeof bestExchangeFormSchema>;

export default function BestExchangeForm() {
    const weekQuery = api.timetableController.getSuitableTimetables.useQuery();

    const formComplex = useForm<BestExchangeFormSchema>({
        resolver: zodResolver(bestExchangeFormSchema),
        defaultValues: {
            [FIELD_ARRAY_NAME]: {
                info: { date: new Date(), sequenceId: 'Y2024W05' },
                swappers: [
                    {
                        staffName: 'Felix',
                        staffId: '602949',
                        rowId: 'A5',
                        currentDuty: '510',
                        targetDuty: '129'
                    }
                ]
            }
        },
        mode: 'onChange'
    });
    const { control, handleSubmit, reset } = formComplex;

    const {
        fields,
        append,
        update,
        prepend,
        insert,
        remove,
        move,
        replace,
        swap
    } = useFieldArray<BestExchangeFormSchema>({
        control,
        name: `${FIELD_ARRAY_NAME}.swappers`
    });

    function onExchangeSubmit(values: BestExchangeFormSchema) {
        console.log(values);
        toast.success(JSON.stringify(values, null, 2), {
            position: 'bottom-center'
        });
    }

    function onExchangeError(err: FieldErrors<BestExchangeFormSchema>) {
        toast.error(`${JSON.stringify(err[FIELD_ARRAY_NAME]?.info, null, 2)}`);
        console.log(err);
        return err;
    }

    if (weekQuery.status !== 'success') {
        return <>Loading...</>;
    }
    const { data: weekData } = weekQuery;
    return (
        <Form {...formComplex}>
            <form
                className="min-h-screen"
                onSubmit={handleSubmit(onExchangeSubmit, onExchangeError)}
            >
                <section className="flex gap-4">
                    <FormField
                        control={formComplex.control}
                        name="exchange.info.date"
                        render={({ field }) => {
                            return (
                                <FormItem className="flex flex-col gap-2">
                                    <FormLabel>日期</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={'outline'}
                                                        className={cn(
                                                            'w-[180px] pl-3 text-center font-normal',
                                                            !field.value &&
                                                                'text-muted-foreground'
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                'yyyy-MM-dd'
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
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
                                                        field.value ||
                                                        new Date()
                                                    }
                                                    onSelect={field.onChange}
                                                    weekStartsOn={1}
                                                    showWeekNumber
                                                    disableNavigation
                                                    numberOfMonths={2}
                                                    // initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormDescription>
                                        Please choose target date.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <FormField
                        control={formComplex.control}
                        name="exchange.info.sequenceId"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>週次</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            maxLength={6}
                                            className="w-10 "
                                            type={'number'}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                </section>
                <section className="flex w-fit flex-col items-center gap-4">
                    {fields.map((field, index) => (
                        <Edit
                            key={field.id}
                            control={control}
                            update={update}
                            index={index}
                            value={field}
                            remove={remove}
                        />
                    ))}
                </section>
                <section className="flex flex-col items-center justify-center gap-4">
                    <Button
                        className="w-max"
                        variant="ghost"
                        type="button"
                        onClick={() => {
                            append({
                                staffName: '',
                                staffId: '',
                                rowId: '',
                                targetDuty: '',
                                currentDuty: ''
                            });
                        }}
                    >
                        <IconIconPlusCircle />
                    </Button>
                    <section className="flex gap-4">
                        <Button
                            variant={'destructive'}
                            className="w-auto"
                            onClick={() => reset()}
                        >
                            Reset
                        </Button>
                        <Button
                            variant={'proceed'}
                            type="submit"
                            onClick={() => {
                                return;
                            }}
                        >
                            Submit
                        </Button>
                    </section>
                    {/* <pre>{JSON.stringify(weekData, null, 2)}</pre> */}
                </section>
            </form>
        </Form>
    );
}

type DisplayProps = { control: Control<BestExchangeFormSchema>; index: number };
const Display = ({ control, index }: DisplayProps) => {
    const data = useWatch({
        control,
        name: `${FIELD_ARRAY_NAME}.swappers.${index}`
    });

    const candidateNumber = index + 1;
    return (
        <>
            <p>{candidateNumber}</p>
            <p>{data?.staffName}</p>
        </>
    );
};

type EditProps = {
    update: UseFieldArrayUpdate<BestExchangeFormSchema>;
    index: number;
    value: FieldArrayWithId<BestExchangeFormSchema>;
    control: Control<BestExchangeFormSchema>;
    remove: UseFieldArrayRemove;
};
const Edit = ({ remove, update, index, value, control }: EditProps) => {
    const { register, handleSubmit } = useForm({
        defaultValues: value
    });

    return (
        <Card className="w-[90%]">
            <CardTitle className="flex justify-between">
                <Display control={control} index={index} />
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        remove(index);
                    }}
                >
                    <Minus />
                </Button>
            </CardTitle>
            <CardContent className="flex items-center ">
                <section className="flex flex-col gap-4">
                    <FormField
                        name={`exchange.swappers.${index}.staffName`}
                        control={control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Staff Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Name"
                                        className="w-min"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is your name
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name={`exchange.swappers.${index}.staffId`}
                        control={control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Staff ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="StaffId" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your staff ID
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name={`exchange.swappers.${index}.rowId`}
                        control={control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ROW ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="rowId" {...field} />
                                </FormControl>
                                <FormDescription>請輸入行序</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>
                <section>
                    <FormField
                        name={`exchange.swappers.${index}.currentDuty`}
                        control={control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Duty</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="current Duty"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is your name
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name={`exchange.swappers.${index}.targetDuty`}
                        control={control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Target Duty</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="target Duty"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is your name
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={handleSubmit((data) => update(index, data))}
                    variant="outline"
                >
                    Verify
                </Button>
            </CardFooter>
        </Card>
    );
};
