import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import moment from 'moment';

import type { combineDateWithSequence } from '~/pages';

import { EditableCell } from './RotaTable';
import { api } from '~/utils/api';

export type Rota = ReturnType<typeof combineDateWithSequence>[0];

const columnHelper = createColumnHelper<Rota>();

export const RotaColumns = [
    columnHelper.accessor('date', {
        header: '日期',
        cell: ({ getValue }) => {
            return moment(getValue(), 'YYYYMMDD ddd').format('DD ddd');
        }
    }),
    columnHelper.accessor('timetable.prefix', {
        id: 'prefix',
        header: '時間表'
    }),
    columnHelper.accessor('standardDuty', {
        id: 'standardDuty',
        header: '標準輪值'
    }),
    columnHelper.accessor('actualDuty', {
        id: 'actualDuty',
        header: '真實輪值',
        cell: EditableCell
    })
];
