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
import { RotaTable } from '~/components/ShiftTable/RotaTable';
import { RotaColumns } from '~/components/ShiftTable/RotaColumn';

type dates = ReturnType<typeof getFitTimetable>;

export function combineDateWithSequence(dates: dates, sequence: string[]) {
    const sequenceDetail = dates.map((date, i) => ({
        ...date,
        standardDuty: sequence[i] as string,
        defaultDuty: date.timetable?.prefix.concat(sequence[i] as string) ?? ''
    }));

    return sequenceDetail;
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
                {`${categoryName}更行序${rowInQuery + 1}`}
            </h1>
            {/* <h2 className="text-lg font-semibold">{`${categoryName}更行序${
                rowInQuery + 1
            }`}</h2> */}
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

            <RotaTable columns={RotaColumns} data={combinedDetails} />
        </div>
    );
};

export default LandingPage;
