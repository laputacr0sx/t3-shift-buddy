import React, { useMemo, useState } from 'react';
import { type NextPageWithLayout } from './_app';

import { api } from '~/utils/api';
import { slicedKLN } from '~/utils/standardRosters';
import { Button } from '~/components/ui/button';
import {
    getPrefixDetailFromId,
    getRosterRow,
    stringifyCategory,
    getFitTimetable
} from '~/utils/helper';
import moment from 'moment';
import { Label } from '~/components/ui/label';

export function combineDateWithSequence(
    dates: ReturnType<typeof getFitTimetable>,
    sequence: string[]
) {
    return dates.map((date, i) => ({
        ...date,
        standardDuty: sequence[i] as string
    }));
}

const LandingPage = () => {
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

    const combinedDetails = combineDateWithSequence(
        datesWithTimetable,
        sequence
    );

    console.log(combinedDetails);

    return (
        <div className="flex h-full w-screen flex-col gap-4 px-4">
            <h1 className="justify-center py-2 text-center align-middle font-mono text-3xl font-bold tracking-wide text-foreground">
                {correspondingMoment.format(`Y年WW期`)}
            </h1>
            <h2 className="text-lg font-semibold">{`${categoryName}更行序${
                rowInQuery + 1
            }`}</h2>
            <div className="flex items-center justify-between align-middle">
                <Button
                    variant={'outline'}
                    size={'lg'}
                    onClick={() => {
                        setWeekDifference((prev) => prev - 1);
                    }}
                >
                    上週
                </Button>
                <Button
                    className=""
                    variant={'secondary'}
                    size={'lg'}
                    onClick={() => {
                        setWeekDifference(0);
                    }}
                >
                    本週
                </Button>
                <Button
                    variant={'outline'}
                    size={'lg'}
                    onClick={() => {
                        setWeekDifference((prev) => prev + 1);
                    }}
                >
                    下週
                </Button>
            </div>
            <div className="flex flex-col items-start justify-center gap-2">
                {datesWithTimetable?.map(({ date, timetable }, i) => {
                    return (
                        // <p key={date} className="text-left font-mono">
                        <Label key={date} className="text-left font-mono">
                            {date} {timetable?.prefix} {sequence[i]}
                        </Label>
                        // </p>
                    );
                })}
            </div>
        </div>
    );
};

export default LandingPage;
