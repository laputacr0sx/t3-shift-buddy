import moment from 'moment';
import { useMemo, useState } from 'react';
import { api } from '~/utils/api';
import {
    combineDateWithSequence,
    getFitTimetable,
    getPrefixDetailFromId,
    getRosterRow,
    getRota,
    stringifyCategory
} from '~/utils/helper';
import useGetUsermeta from './useGetUsermeta';

export default function useCombineDetails() {
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

    const { userData: userMetadata } = useGetUsermeta();

    const { tc, rotaCat } = useMemo(() => {
        const { tc, en } = stringifyCategory(userMetadata?.row);

        const rotaCat = getRota(en);

        return { tc, en, rotaCat };
    }, [userMetadata]);

    const { data: actualSequenceObject } =
        api.sequenceController.getSequence.useQuery(
            {
                sequenceId: `${correspondingMoment.format('[Y]YYYY[W]WW')}A89`
            },
            { enabled: !!userMetadata }
        );

    const actualSequence = useMemo(() => {
        if (!actualSequenceObject) return null;
        return actualSequenceObject.dutyNumbers;
    }, [actualSequenceObject]);

    console.log(actualSequenceObject);

    const { sequence, rowInQuery } = useMemo(
        () => getRosterRow(rotaCat, userMetadata?.row, weekDifference),
        [rotaCat, userMetadata?.row, weekDifference]
    );

    const combinedDetails = combineDateWithSequence(
        datesWithTimetable,
        sequence,
        actualSequence
    );

    return {
        setWeekDifference,
        correspondingMoment,
        tc,
        rowInQuery,
        combinedDetails
    };
}
