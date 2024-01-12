import React, {
    useMemo,
    type ReactElement,
    useState,
    useCallback
} from 'react';
import { type NextPageWithLayout } from './_app';
import Layout from '~/components/ui/layouts/AppLayout';

import { api } from '~/utils/api';
import { Rota, slicedKLN } from '~/utils/standardRosters';
import { Button } from '~/components/ui/button';
import toast from 'react-hot-toast';
import { autoPrefix } from '~/utils/helper';
import moment from 'moment';
import { Rosta } from '~/utils/customTypes';

const LandingPage: NextPageWithLayout = () => {
    const [clientYearAndWeek, setClientYearAndWeek] = useState<number[]>(() => [
        moment().isoWeeks(),
        moment().year()
    ]);
    const KLNRoster = useMemo(() => slicedKLN(), []);

    const dates = useMemo(
        () =>
            autoPrefix(false, `${clientYearAndWeek[0] as number}` ?? undefined),
        [clientYearAndWeek]
    );

    // const {
    //     data: timetableData,
    //     isLoading: timetableLoading,
    //     error: timetableError
    // } = api.timetableController.getAllTimetables.useQuery(undefined, {
    //     refetchOnWindowFocus: false
    // });

    const {
        data: userMetadata,
        isLoading: loadingMetadata,
        error: errorMetadata
    } = api.userController.getUserMetadata.useQuery();

    function getRosterRow(
        rotaArray: Rota,
        rowNumberWithCategory: string | undefined,
        weekNumber: number
    ): Rosta {
        const rotaLength = rotaArray.length;
        if (!rowNumberWithCategory) {
            return new Array<string>(7).fill('');
        }
        const rowNumber = rowNumberWithCategory.match(/\d+/)?.[0];
        if (!rowNumber) {
            return ['行', '序', '錯', '誤', '!', '!', '!'];
        }
        if (+rowNumber > rotaLength || +rowNumber < 1) {
            return ['行', '序', '出', '錯', '!', '!', '!'];
        }
        const sequence = rotaArray[+rowNumber - 1];
        if (!sequence) {
            return ['找', '不', '到', '行', '序', '!', '!'];
        }

        return sequence;
    }

    const rosta = useMemo(
        () =>
            getRosterRow(
                KLNRoster,
                userMetadata?.row,
                clientYearAndWeek[0] as number
            ),
        [KLNRoster, userMetadata?.row, clientYearAndWeek]
    );

    console.log(rosta);

    return (
        <div className="relative">
            <h1 className="justify-center py-5 text-center align-middle font-mono text-3xl font-bold tracking-wide text-foreground">
                {clientYearAndWeek[1]}年第{clientYearAndWeek[0]}期更
            </h1>
            {/* {timetableLoading ? (
                <>Loading...</>
            ) : timetableError ? (
                <p>{timetableError.message}</p>
            ) : (
                timetableData.map((timetable) => (
                    <p key={timetable.toc}>
                        {timetable.prefix}{' '}
                        {timetable.dateOfEffective.toDateString()}
                    </p>
                ))
            )} */}
            <div className="flex items-center justify-center align-middle">
                <Button
                    variant={'outline'}
                    size={'sm'}
                    onClick={() => {
                        setClientYearAndWeek((prev) => {
                            const [week, year] = prev;
                            return [(week as number) - 1, year as number];
                        });
                    }}
                >
                    上一週
                </Button>
                <Button
                    className=""
                    variant={'secondary'}
                    size={'sm'}
                    onClick={() => {
                        setClientYearAndWeek([
                            moment().isoWeeks(),
                            moment().year()
                        ]);
                    }}
                >
                    本週
                </Button>
                <Button
                    variant={'outline'}
                    size={'sm'}
                    onClick={() => {
                        setClientYearAndWeek((prev) => {
                            const [week, year] = prev;
                            return [(week as number) + 1, year as number];
                        });
                    }}
                >
                    下一週
                </Button>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
                {dates.map(({ date, prefix }) => {
                    return (
                        <p key={date} className="font-mono">
                            {date} {prefix}
                        </p>
                    );
                })}
            </div>
        </div>
    );
};

LandingPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default LandingPage;
