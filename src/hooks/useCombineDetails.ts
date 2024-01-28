import moment from 'moment';
import { useMemo, useState } from 'react';
import { api } from '~/utils/api';
import {
    combineDateWithSequence,
    getFitTimetable,
    getPrefixDetailFromId,
    getRosterRow,
    stringifyCategory
} from '~/utils/helper';
import { rotaET, rotaKLN, rotaSHS } from '~/utils/standardRosters';

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

    const { data: userMetadata } =
        api.userController.getUserMetadata.useQuery(undefined);

    const { tc, rotaCat } = useMemo(() => {
        const { tc, en } = stringifyCategory(userMetadata?.row);

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

        const rotaCat = getRota(en);

        return { tc, en, rotaCat };
    }, [userMetadata]);

    const { sequence, rowInQuery } = useMemo(
        () => getRosterRow(rotaCat, userMetadata?.row, weekDifference),
        [rotaCat, userMetadata?.row, weekDifference]
    );

    const combinedDetails = combineDateWithSequence(
        datesWithTimetable,
        sequence
    );

    return {
        setWeekDifference,
        correspondingMoment,
        tc,
        rowInQuery,
        combinedDetails
    };
}
