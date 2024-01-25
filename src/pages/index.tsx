import React, { useMemo, useState } from 'react';

import { api } from '~/utils/api';
import { slicedKLN } from '~/utils/standardRosters';

import {
    getPrefixDetailFromId,
    getRosterRow,
    stringifyCategory,
    getFitTimetable
} from '~/utils/helper';
import moment from 'moment';

import RotaTable from '~/components/ShiftTable/RotaTable';
import { RotaColumns } from '~/components/ShiftTable/RotaColumn';
import { WeekControlButton } from '~/components/WeekControlButton';
import { TestTable } from '~/components/ShiftTable/TestTable';

type Dates = ReturnType<typeof getFitTimetable>;

export function combineDateWithSequence(dates: Dates, sequence: string[]) {
    const sequenceDetail = dates.map((date, i) => ({
        ...date,
        standardDuty: sequence[i] as string,
        actualDuty: ''
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

    const { data: userMetadata } =
        api.userController.getUserMetadata.useQuery(undefined);

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

    const { data } = api.dutyController.getDutiesBySequence.useQuery(
        combinedDetails.map(
            ({ timetable, standardDuty, actualDuty }) =>
                timetable?.prefix.concat(
                    actualDuty.length <= 0 ? standardDuty : actualDuty
                ) || 'R15101'
        )
    );

    console.log(combinedDetails);

    return (
        <div className="flex h-full w-screen flex-col gap-4 px-4">
            <h1 className="justify-center py-2 text-center align-middle font-mono text-2xl font-bold tracking-wide text-foreground">
                {correspondingMoment.format(`Y年WW期`)}
                {`${categoryName}更行序${rowInQuery + 1}`}
            </h1>
            <WeekControlButton setWeekDifference={setWeekDifference} />
            {/* {combinedDetails ? (
                <RotaTable columns={RotaColumns} data={combinedDetails} />
            ) : null} */}
            <TestTable defaultData={combinedDetails} />
        </div>
    );
};

export default LandingPage;
