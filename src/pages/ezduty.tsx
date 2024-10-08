import { useState } from 'react';
import PageTitle from '~/components/PageTitle';
import { TestTable } from '~/components/ShiftTable/TestTable';
import TableLoading from '~/components/TableLoading';
import { WeekControlButton } from '~/components/WeekControlButton';

import { clerkClient, getAuth } from '@clerk/nextjs/server';
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType
} from 'next';

import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import { appRouter } from '~/server/api/root';
import { createContextInner } from '~/server/api/trpc';
import { api } from '~/utils/api';
import { userPrivateMetadataSchema } from '~/utils/zodSchemas';
import React from 'react';

type EasyDutyProps = InferGetServerSidePropsType<typeof getServerSideProps>;

function EasyDuty(props: EasyDutyProps) {
    const [weekDifference, setWeekDifference] = useState(0);

    const {
        data: weekDetails,
        isLoading: weekDetailsLoading,
        error: weekDetailsError
    } = api.weekDetailsController.getDetails.useQuery({ weekDifference });

    if (weekDetailsLoading) return <TableLoading />;
    if (weekDetailsError) return <>Something Went Wrong</>;

    const { detailsWithWeather, articulatedTitle, sequenceId } = weekDetails;

    return (
        <div className="flex h-full w-screen flex-col gap-4 px-4">
            <PageTitle>{articulatedTitle}</PageTitle>
            <WeekControlButton setWeekDifference={setWeekDifference} />
            <TestTable
                defaultData={detailsWithWeather}
                sequenceId={sequenceId}
            />
        </div>
    );
}

export const getServerSideProps = async (
    ctx: GetServerSidePropsContext<{ userData: string }>
) => {
    const authObj = getAuth(ctx.req);

    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: createContextInner({ auth: authObj, user: null, clerkMeta: null }),
        transformer: superjson
    });

    // await helpers.weekDetailsController.getDetails.prefetch({
    //     weekDifference: 0
    // });

    const userId = !!authObj.userId ? authObj.userId : '';

    const userData = await clerkClient.users
        .getUser(userId)
        .then((user) => user.privateMetadata);

    const parseResult = userPrivateMetadataSchema.safeParse(userData);

    if (!parseResult.success) {
        return {
            props: {
                userData: JSON.stringify({
                    row: '',
                    staffId: '',
                    weekNumber: 0,
                    updatedAt: new Date().toISOString()
                })
            }
        };
    }

    return {
        props: { userData: JSON.stringify(userData) }
    };
};

export default EasyDuty;
