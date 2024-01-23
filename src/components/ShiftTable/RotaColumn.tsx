import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import moment from 'moment';
import { combineDateWithSequence } from '~/pages';
import { convertDurationDecimal } from '~/utils/helper';

type Rota = ReturnType<typeof combineDateWithSequence>[0];

const columnHelper = createColumnHelper<Rota>();

export const RotaColumns: ColumnDef<Rota>[] = [
    {
        id: 'date',
        accessorKey: 'date',
        header: '日期',
        cell: ({ getValue }) => {
            const rowValue = getValue() as string;
            return <p className="font-mono">{rowValue}</p>;
        }
    },
    {
        id: 'timetable',
        accessorKey: 'timetable.prefix',
        header: '頭綴'
    },
    {
        id: 'defaultDuty',
        accessorKey: 'defaultDuty',
        header: '標準輪值表'
    }
];
