import React, { useMemo, useState } from 'react';

import { api } from '~/utils/api';
import { rotaET, rotaKLN, rotaSHS } from '~/utils/standardRosters';

import {
    getPrefixDetailFromId,
    getRosterRow,
    stringifyCategory,
    getFitTimetable
} from '~/utils/helper';
import moment from 'moment';

import { WeekControlButton } from '~/components/WeekControlButton';
import { TestTable } from '~/components/ShiftTable/TestTable';

type Dates = ReturnType<typeof getFitTimetable>;

export function combineDateWithSequence(dates: Dates, sequence: string[]) {
    const sequenceDetail = dates?.map((date, i) => ({
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

    const datesWithTimetable = useMemo(() => {
        if (!timetables) return null;
        return getFitTimetable(timetables, datesOfWeek);
    }, [timetables, datesOfWeek]);

    const { data: userMetadata } =
        api.userController.getUserMetadata.useQuery(undefined);

    const { tc, en } = useMemo(
        () => stringifyCategory(userMetadata?.row),
        [userMetadata]
    );

    const getRota = (categoryName: string) => {
        switch (categoryName) {
            case 'KLN':
                return rotaKLN;
            case 'SHS':
                return rotaSHS;
            case 'ET':
                return rotaET;
            default:
                return rotaKLN;
        }
    };

    const { sequence, rowInQuery } = useMemo(
        () => getRosterRow(getRota(en), userMetadata?.row, weekDifference),
        [en, userMetadata?.row, weekDifference]
    );

    const combinedDetails = combineDateWithSequence(
        datesWithTimetable,
        sequence
    );

    return (
        <div className="flex h-full w-screen flex-col gap-4 px-4">
            <h1 className="justify-center py-2 text-center align-middle font-mono text-2xl font-bold tracking-wide text-foreground">
                {correspondingMoment.format(`Y年WW期`)}
                {`${tc}更行序${rowInQuery + 1}`}
            </h1>
            <WeekControlButton setWeekDifference={setWeekDifference} />
            {combinedDetails ? (
                <TestTable defaultData={combinedDetails} />
            ) : null}
        </div>
    );
};

export default LandingPage;
