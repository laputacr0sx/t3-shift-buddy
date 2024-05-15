import {
    useForm,
    useFieldArray,
    useWatch,
    type Control,
    type UseFieldArrayUpdate,
    type FieldArrayWithId,
    Controller,
    type FieldErrors
} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '../ui/form';
import IconIconPlusCircle from '../svgIcons/CirclePlus';

const FIELD_ARRAY_NAME = 'exchange';

const bestExchangeFormSchema = z.object({
    [FIELD_ARRAY_NAME]: z
        .object({ firstName: z.string().max(6, 'too long!') })
        .array()
});
type BestExchangeForm = z.infer<typeof bestExchangeFormSchema>;

export default function BestExchangeForm() {
    const formComplex = useForm<BestExchangeForm>({
        resolver: zodResolver(bestExchangeFormSchema),
        defaultValues: {
            [FIELD_ARRAY_NAME]: [{ firstName: 'felix' }, { firstName: 'flora' }]
        }
    });
    const { control, handleSubmit, register, reset } = formComplex;

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
    } = useFieldArray<BestExchangeForm>({
        control,
        name: FIELD_ARRAY_NAME
    });

    function onExchangeSubmit(values: BestExchangeForm) {
        console.log(values);
        toast.success(JSON.stringify(values, null, 2), {
            position: 'bottom-center'
        });
    }

    function onExchangeError(err: FieldErrors<BestExchangeForm>) {
        toast.error('error occurred');
        console.log(err);
        return err;
    }

    return (
        <Form {...formComplex}>
            <form onSubmit={handleSubmit(onExchangeSubmit, onExchangeError)}>
                {fields.map((item, index) => {
                    return (
                        <li key={item.id}>
                            <Controller
                                name={`${FIELD_ARRAY_NAME}.${index}.firstName`}
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Label {...field}>Hello</Label>
                                        <Input
                                            {...field}
                                            className="dark:bg-slate-700"
                                        />
                                    </>
                                )}
                            />
                            <Button
                                variant="destructive"
                                type="button"
                                onClick={() => remove(index)}
                            >
                                Delete
                            </Button>
                        </li>
                    );
                })}
                <section>
                    <Button
                        type="button"
                        onClick={() => {
                            append({
                                firstName: 'appendBill'
                            });
                        }}
                    >
                        append
                    </Button>
                    <Button
                        type="button"
                        onClick={() =>
                            prepend({
                                firstName: 'prependFirstName'
                            })
                        }
                    >
                        prepend
                    </Button>
                    <Button
                        type="button"
                        onClick={() =>
                            insert(2, {
                                firstName: 'insertFirstName'
                            })
                        }
                    >
                        insert at
                    </Button>
                    <Button type="button" onClick={() => swap(1, 2)}>
                        Swap
                    </Button>
                    <Button type="button" onClick={() => move(1, 2)}>
                        move
                    </Button>
                    <Button
                        type="button"
                        onClick={() =>
                            replace([
                                {
                                    firstName: 'test1'
                                },
                                {
                                    firstName: 'test2'
                                }
                            ])
                        }
                    >
                        replace
                    </Button>

                    <Button type="button" onClick={() => remove(1)}>
                        remove at
                    </Button>

                    <Button type="button" onClick={() => reset()}>
                        reset
                    </Button>
                </section>

                <Button type="submit" variant="proceed">
                    Submit
                </Button>
            </form>
        </Form>
    );

    return (
        <Form {...formComplex}>
            <form onSubmit={handleSubmit((data) => onExchangeSubmit(data))}>
                {fields.map((field, index) => (
                    <Edit
                        key={field.id}
                        control={control}
                        update={update}
                        index={index}
                        value={field}
                    />
                ))}

                <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                        append({ firstName: '' });
                    }}
                >
                    <IconIconPlusCircle />
                </Button>
                <Input type="submit" />
            </form>
        </Form>
    );
}

type DisplayProps = { control: Control<BestExchangeForm>; index: number };
const Display = ({ control, index }: DisplayProps) => {
    const data = useWatch({
        control,
        name: `${FIELD_ARRAY_NAME}.${index}`
    });
    return <p>{data?.firstName}</p>;
};

type EditProps = {
    update: UseFieldArrayUpdate<BestExchangeForm>;
    index: number;
    value: FieldArrayWithId<BestExchangeForm>;
    control: Control<BestExchangeForm>;
};
const Edit = ({ update, index, value, control }: EditProps) => {
    const { register, handleSubmit } = useForm({
        defaultValues: value
    });

    return (
        <div>
            <Display control={control} index={index} />

            <Input
                placeholder="first name"
                {...register(`firstName`, { required: true })}
            />

            <Button
                type="submit"
                onClick={handleSubmit((data) => update(index, data))}
                variant="destructive"
            >
                Submit
            </Button>
        </div>
    );
};
