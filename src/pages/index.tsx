import React, { useMemo, type ReactElement, useState } from 'react';
import { type NextPageWithLayout } from './_app';
import Layout from '~/components/ui/layouts/AppLayout';

import { api } from '~/utils/api';
import { slicedKLN } from '~/utils/standardRosters';
import { Button } from '~/components/ui/button';
import {
    type PrefixDetail,
    getPrefixDetailFromId,
    getRosterRow,
    stringifyCategory
} from '~/utils/helper';
import moment from 'moment';
import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '~/server/api/root';

const LandingPage: NextPageWithLayout = () => {
    function getFitTimetable(
        timetables:
            | inferProcedureOutput<
                  AppRouter['timetableController']['getAllTimetables']
              >
            | undefined,
        prefixes: PrefixDetail[]
    ) {
        return prefixes.map((prefix) => {
            if (!timetables) return { ...prefix, timetable: null };

            const samePrefixTimetable = timetables?.filter(
                (timetable) =>
                    (timetable.prefix.includes(prefix.prefix) &&
                        moment(prefix.date, 'YYYYMMDD ddd').isSameOrAfter(
                            moment(timetable.dateOfEffective)
                        )) ??
                    timetable
            );

            const fittedTimetable = samePrefixTimetable?.reduce(
                (prevTimeTable, currTimetable) => {
                    const dateConcerned = moment(prefix.date, 'YYYYMMDD ddd');
                    const prevDOEDiff = moment(
                        prevTimeTable.dateOfEffective
                    ).diff(dateConcerned);
                    const currDOEDiff = moment(
                        currTimetable.dateOfEffective
                    ).diff(dateConcerned);

                    return prevDOEDiff - currDOEDiff < 0
                        ? currTimetable
                        : prevTimeTable;
                }
            );
            return { ...prefix, timetable: fittedTimetable };
        });
    }

    const [weekDifference, setWeekDifference] = useState(0);
    const correspondingMoment = useMemo(
        () => moment().add(weekDifference, 'w'),
        [weekDifference]
    );
    const KLNRota = useMemo(() => slicedKLN(), []);

    const datesOfWeek = useMemo(
        () => getPrefixDetailFromId(correspondingMoment.format(`[Y]Y[W]w`)),
        [correspondingMoment]
    );

    const {
        data: timetables,
        isLoading: timetableLoading,
        error: timetableError
    } = api.timetableController.getAllTimetables.useQuery(undefined, {
        refetchOnWindowFocus: false
    });

    const datesWithTimetable = useMemo(
        () => getFitTimetable(timetables, datesOfWeek),
        [timetables, datesOfWeek]
    );

    const { data: userMetadata } = api.userController.getUserMetadata.useQuery(
        undefined,
        {
            refetchOnWindowFocus: false
        }
    );

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
                {datesWithTimetable?.map(({ date, prefix, timetable }, i) => {
                    return (
                        <p key={date} className="text-left font-mono">
                            {date} {timetable?.prefix} {sequence[i]}
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
