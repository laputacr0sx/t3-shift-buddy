import React, { useState } from 'react';
import PageTitle from '~/components/PageTitle';
import { TestTable } from '~/components/ShiftTable/TestTable';
import TableLoading from '~/components/TableLoading';
import { WeekControlButton } from '~/components/WeekControlButton';

import { api } from '~/utils/api';

function EasyDuty() {
    const [weekDifference, setWeekDifference] = useState(0);

    const {
        data: weekDetails,
        isLoading: weekDetailsLoading,
        error: weekDetailsError
    } = api.weekDetailsController.getDetails.useQuery({ weekDifference });

    if (weekDetailsLoading) return <TableLoading />;
    if (weekDetailsError) return <>Something Went Wrong</>;

    const { combinedDetails, articulatedTitle } = weekDetails;

    return (
        <div className="flex h-full w-screen flex-col gap-4 px-4">
            <PageTitle>{articulatedTitle}</PageTitle>
            <WeekControlButton setWeekDifference={setWeekDifference} />

            <TestTable defaultData={combinedDetails} />
        </div>
    );
}

export default EasyDuty;
