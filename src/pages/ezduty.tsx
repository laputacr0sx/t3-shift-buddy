import { useState } from 'react';
import PageTitle from '~/components/PageTitle';
import { TestTable } from '~/components/ShiftTable/TestTable';
import TableLoading from '~/components/TableLoading';
import { WeekControlButton } from '~/components/WeekControlButton';

import { getAuth, clerkClient } from '@clerk/nextjs/server';
import type {
    GetServerSideProps,
    GetServerSidePropsContext,
    InferGetServerSidePropsType
} from 'next';

import { api } from '~/utils/api';
import { userPrivateMetadataSchema } from '~/utils/zodSchemas';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';
import superjson from 'superjson';
import { createContextInner } from '~/server/api/trpc';
import type { CustomUserPrivateMetadata } from '~/utils/customTypes';

function EasyDuty(
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
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

export const getServerSideProps = (async (ctx: GetServerSidePropsContext) => {
    const authObj = getAuth(ctx.req);

    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: createContextInner({ auth: authObj, user: null, clerkMeta: null }),
        transformer: superjson
    });

    await helpers.weekDetailsController.getDetails.prefetch({
        weekDifference: 0
    });

    const userId = !!authObj.userId ? authObj.userId : '';

    const userData = await clerkClient.users
        .getUser(userId)
        .then((user) => user.privateMetadata);

    // const metadata = userObject.privateMetadata as UserPrivateMetadata;

    const parseResult = userPrivateMetadataSchema.safeParse(userData);

    if (!parseResult.success) {
        return {
            props: {
                userData: {
                    row: '',
                    staffId: '',
                    weekNumber: 0,
                    updatedAt: new Date().toISOString()
                } as CustomUserPrivateMetadata
            }
        };
    }

    return {
        props: { userData, trpcState: helpers.dehydrate() }
    };
}) satisfies GetServerSideProps<{ userData: CustomUserPrivateMetadata }>;

export default EasyDuty;
