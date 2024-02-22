import moment from 'moment';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

import { useCallback } from 'react';
import type {
    DefaultData,
    SevenSlotsSearchForm
} from '~/components/SevenSlotsSearchForm';

import { abbreviatedDutyNumber } from '~/utils/regex';
import { dayDetailName } from '~/utils/zodSchemas';

function useShiftQuery(prefixData: string[] | undefined) {
    const router = useRouter();
    const pathname = usePathname();
    // const searchParams = useSearchParams();

    const handleQuery = useCallback(
        async (defaultData: DefaultData, data: SevenSlotsSearchForm) => {
            const newParams = new URLSearchParams();

            if (typeof prefixData === 'undefined') return newParams;

            data[dayDetailName]?.forEach(({ shiftCode }, i) => {
                const date = moment(
                    defaultData[i]?.date,
                    'YYYYMMDD ddd'
                ).format('YYYYMMDD');
                const prefix = defaultData[i]?.timetable.prefix as string;

                const shiftCodeWithPrefix = shiftCode.match(
                    abbreviatedDutyNumber
                )
                    ? `${prefix}${shiftCode}`
                    : `${shiftCode}`;
                if (shiftCode) {
                    newParams.set(date, shiftCodeWithPrefix);
                }
            });
            await router.push(`${pathname}?${newParams.toString()}`);

            return newParams;
        },
        [pathname, router, prefixData]
    );

    return { router, handleQuery };
}

export default useShiftQuery;
