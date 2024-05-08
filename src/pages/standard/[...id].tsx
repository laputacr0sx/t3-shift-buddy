import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType
} from 'next';
import moment from 'moment';
import superjson from 'superjson';

import { clerkClient } from '@clerk/nextjs';
import { getAuth } from '@clerk/nextjs/server';
import { createServerSideHelpers } from '@trpc/react-query/server';

import { appRouter } from '~/server/api/root';
import { createContextInner } from '~/server/api/trpc';
import { api } from '~/utils/api';

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const ids = context.params?.id as string[];
    console.log(ids);

    const auth = getAuth(context.req);
    const user = await clerkClient.users.getUser(auth.userId ?? '');

    const today = moment().format('YYYYMMDD ddd');

    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: createContextInner({ auth, user, clerkMeta: null }),
        transformer: superjson
    });

    return {
        props: {
            trpcState: helpers.dehydrate(),
            ids,
            today
        }
    };
}

type DayViewProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function PostViewPage(props: DayViewProps) {
    const { today, ids } = props;

    const {
        data: weekDetails,
        status: weekDetailsStatus,
        isLoading: weekDetailsLoading
    } = api.weekDetailsController.getDetails.useQuery({
        weekDifference: 0
    });

    if (weekDetailsStatus !== 'success') {
        return <>Loading...</>;
    }

    if (weekDetailsLoading) return <>Loading...</>;

    const todayDetail = weekDetails.detailsWithWeather.filter(
        (detail) => detail.date === today
    )[0];

    return (
        <>
            <h1>{weekDetails.articulatedTitle}</h1>
            <h1>{todayDetail?.date}</h1>
            <p>{todayDetail?.timetable.prefix}</p>
            <p>{todayDetail?.actualDuty}</p>
            <pre>{JSON.stringify(todayDetail, null, 2)}</pre>
        </>
    );
}
