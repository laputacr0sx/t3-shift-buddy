import React, { useMemo, type ReactElement, useState } from 'react';
import { type NextPageWithLayout } from './_app';
import Layout from '~/components/ui/layouts/AppLayout';

import { api } from '~/utils/api';
import { slicedKLN } from '~/utils/standardRosters';
import { Button } from '~/components/ui/button';
import {
    getPrefixDetailFromId,
    getRosterRow,
    stringifyCategory
} from '~/utils/helper';
import moment from 'moment';

const LandingPage: NextPageWithLayout = () => {
    const [weekDifference, setWeekDifference] = useState(0);
    const correspondingMoment = useMemo(
        () => moment().isoWeekday('monday').add(weekDifference, 'w'),
        [weekDifference]
    );
    const KLNRota = useMemo(() => slicedKLN(), []);

    console.log(
        correspondingMoment.isoWeekday('monday').format('YYYY-MM-DD ddd w W')
    );

    const correspondingDates = useMemo(
        () => getPrefixDetailFromId(correspondingMoment.format(`[Y]Y[W]w`)),
        [correspondingMoment]
    );

    const {
        data: userMetadata,
        isLoading: loadingMetadata,
        error: errorMetadata
    } = api.userController.getUserMetadata.useQuery(undefined, {
        refetchOnWindowFocus: false
    });

    const categoryName = useMemo(
        () => stringifyCategory(userMetadata?.row),
        [userMetadata]
    );
    const { sequence, rowInQuery } = useMemo(
        () => getRosterRow(KLNRota, userMetadata?.row, weekDifference),
        [KLNRota, userMetadata?.row, weekDifference]
    );

    return (
        <div className="flex h-full w-screen flex-col gap-4 px-20">
            <h1 className="justify-center py-5 text-center align-middle font-mono text-3xl font-bold tracking-wide text-foreground">
                {correspondingMoment.format(`Y年WW期`)}
            </h1>
            <h2 className="text-lg font-semibold">{`${categoryName}更行序${
                rowInQuery + 1
            }`}</h2>
            <div className="flex items-center justify-between align-middle">
                <Button
                    variant={'outline'}
                    size={'sm'}
                    onClick={() => {
                        setWeekDifference((prev) => prev - 1);
                    }}
                >
                    上週
                </Button>
                <Button
                    className=""
                    variant={'secondary'}
                    size={'sm'}
                    onClick={() => {
                        setWeekDifference(0);
                    }}
                >
                    本週
                </Button>
                <Button
                    variant={'outline'}
                    size={'sm'}
                    onClick={() => {
                        setWeekDifference((prev) => prev + 1);
                    }}
                >
                    下週
                </Button>
            </div>
            <div className="flex flex-col items-start justify-center gap-2">
                {correspondingDates.map(({ date, prefix }, i) => {
                    return (
                        <p key={date} className="text-left font-mono">
                            {date} {prefix} {sequence[i]}
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
