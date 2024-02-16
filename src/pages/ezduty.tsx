import React from 'react';
import PageTitle from '~/components/PageTitle';
import { TestTable } from '~/components/ShiftTable/TestTable';
import { WeekControlButton } from '~/components/WeekControlButton';
import useCombineDetails from '~/hooks/useCombineDetails';

function EasyDuty() {
    const {
        combinedDetails,
        correspondingMoment,
        rowInQuery,
        setWeekDifference,
        tc
    } = useCombineDetails();

    return (
        <div className="flex h-full w-screen flex-col gap-4 px-4">
            <PageTitle>
                {correspondingMoment.format(`Y年WW期`)}
                {`${tc}更行序${rowInQuery + 1}`}
            </PageTitle>
            <WeekControlButton setWeekDifference={setWeekDifference} />
            {combinedDetails ? (
                <TestTable defaultData={combinedDetails} />
            ) : // <TableLoading />
            null}
        </div>
    );
}

export default EasyDuty;
