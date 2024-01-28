import React from 'react';

import { WeekControlButton } from '~/components/WeekControlButton';
import { TestTable } from '~/components/ShiftTable/TestTable';
import useCombineDetails from '~/hooks/useCombineDetails';

const LandingPage = () => {
    const {
        combinedDetails,
        correspondingMoment,
        rowInQuery,
        setWeekDifference,
        tc
    } = useCombineDetails();

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
