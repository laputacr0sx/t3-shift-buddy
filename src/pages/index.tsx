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
import { WeekControlButton } from '~/components/WeekControlButton';

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

    const { data } = api.dutyController.getDutyByDutynumber.useQuery(
        combinedDetails.map((detail) => detail.defaultDuty)
    );

    console.log(data);

    return (
        <div className="flex h-full w-screen flex-col gap-4 px-4">
            <h1 className="justify-center py-2 text-center align-middle font-mono text-3xl font-bold tracking-wide text-foreground">
                {correspondingMoment.format(`Y年WW期`)}
                {`${categoryName}更行序${rowInQuery + 1}`}
            </h1>
            <WeekControlButton setWeekDifference={setWeekDifference} />
            <RotaTable columns={RotaColumns} data={combinedDetails} />
        </div>
    );
};

export default LandingPage;
