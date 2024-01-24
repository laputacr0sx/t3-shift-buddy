import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import moment from 'moment';

import type { combineDateWithSequence } from '~/pages';

import { EditableCell } from './RotaTable';

export type Rota = ReturnType<typeof combineDateWithSequence>[0];

const columnHelper = createColumnHelper<Rota>();

export const RotaColumns =
    // : ColumnDef<Rota>[]
    [
        columnHelper.accessor('date', {
            header: '日期',
            cell: ({ getValue }) => {
                return moment(getValue(), 'YYYYMMDD ddd').format('DD ddd');
            }
        }),
        columnHelper.accessor('timetable.prefix', {
            header: '時間表'
        }),
        columnHelper.accessor('standardDuty', {
            header: '標準輪值'
        }),
        columnHelper.accessor('actualDuty', {
            header: '真實輪值',
            cell: EditableCell
        })
    ];
