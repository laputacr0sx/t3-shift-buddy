import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { combineDateWithSequence } from '~/pages';
import { convertDurationDecimal } from '~/utils/helper';

type Rota = ReturnType<typeof combineDateWithSequence>;

const columnHelper = createColumnHelper<Rota>();

export const AllShiftsColumns: ColumnDef<Rota>[] = [
    columnHelper.group({
        id: 'date',
        header: () => (
            <span className="block border-x border-solid border-sky-700 text-center align-middle text-xl text-slate-700 dark:border-sky-300 dark:text-slate-300">
                日期
            </span>
        ),
        columns: [
            columnHelper.accessor('date', {
                header: () => (
                    <span className="block text-center align-middle text-slate-700 dark:text-slate-300">
                        更號
                    </span>
                ),
                cell: ({ row }) => {
                    const dutyNumber: string = row.getValue('dutyNumber');
                    return (
                        <span className="block py-2 text-center align-middle text-slate-600 dark:text-slate-200">
                            {dutyNumber}
                        </span>
                    );
                },
                footer: (props) => props.column.id
            }),
            {
                accessorKey: 'timetable.prefix',
                header: () => (
                    <span className="block text-center align-middle text-slate-700 dark:text-slate-300">
                        工時
                    </span>
                ),
                cell: ({ row }) => {
                    const duration: string = row.getValue('duration');
                    const durationDecimal = convertDurationDecimal(duration);

                    return (
                        <span className="block py-2 text-center align-middle font-medium text-slate-600 dark:text-slate-200">
                            {durationDecimal}
                        </span>
                    );
                },
                footer: (props) => props.column.id
            }
        ]
    }),
    columnHelper.group({
        id: 'duties',
        header: () => (
            <span className="block border-x border-solid border-sky-700 text-center align-middle text-xl text-teal-700 dark:border-sky-300 dark:text-teal-400">
                上班
            </span>
        ),
        columns: [
            columnHelper.accessor('standardDuty', {
                header: () => (
                    <span className="block text-center align-middle text-teal-700 dark:text-teal-200">
                        地點
                    </span>
                ),
                cell: ({ row }) => {
                    const bNL: string = row.getValue('bNL');
                    return (
                        <span className="block py-2 text-center align-middle font-medium text-teal-600 dark:text-teal-200">
                            {bNL}
                        </span>
                    );
                },
                footer: (props) => props.column.id
            })
        ]
    })
];
