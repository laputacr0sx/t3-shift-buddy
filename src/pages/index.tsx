import React, { useMemo, type ReactElement } from 'react';
import { type NextPageWithLayout } from './_app';
import Layout from '~/components/ui/layouts/AppLayout';

import { api } from '~/utils/api';
import { slicedKLN } from '~/utils/standardRosters';
import { Button } from '~/components/ui/button';
import toast from 'react-hot-toast';

const LandingPage: NextPageWithLayout = () => {
    const {
        data: timetableData,
        isLoading: timetableLoading,
        error: timetableError
    } = api.timetableController.getAllTimetables.useQuery(undefined, {
        refetchOnWindowFocus: false
    });

    const { mutate } = api.rosterController.createRoster.useMutation({
        onError(error, variables, context) {
            toast.error(error.message);
        }
    });

    const KLNRoster = useMemo(() => slicedKLN(), []);

    return (
        <div className="flex flex-col gap-4">
            {timetableLoading ? (
                <>Loading...</>
            ) : timetableError ? (
                <p>{timetableError.message}</p>
            ) : (
                timetableData.map((timetable) => (
                    <p key={timetable.toc}>
                        {timetable.prefix}{' '}
                        {timetable.dateOfEffective.toDateString()}
                    </p>
                ))
            )}
            <Button variant={'outline'} size={'lg'} onClick={() => mutate()}>
                Click to Add
            </Button>
        </div>
    );
};

LandingPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default LandingPage;
