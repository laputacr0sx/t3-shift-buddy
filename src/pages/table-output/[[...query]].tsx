import { createServerSideHelpers } from '@trpc/react-query/server';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import superjson from 'superjson';

import PageTitle from '~/components/PageTitle';

import { appRouter } from '~/server/api/root';
import { createContextInner } from '~/server/api/trpc';
import Custom404 from '../404';
import { StatusCodes } from 'http-status-codes';
import { api } from '~/utils/api';
import { QueryArray } from '~/utils/customTypes';
import { DayDetailTable } from '~/components/ShiftTable/DayDetailTable';
import { DayDetailColumn } from '~/components/ShiftTable/DayDetailColumn';

export function getServerSideProps(
    context: GetServerSidePropsContext<{ query: string }>
) {
    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: createContextInner({ auth: null, user: null, clerkMeta: null }),
        transformer: superjson
    });

    const queryRoute = context.params?.query as string;

    if (queryRoute) {
        const dates = queryRoute.toString().split('&');
        const queryArray: QueryArray = [];
        for (const eachDay in dates) {
            const [day, duty] = eachDay.split('=');
            queryArray.push({ date: day as string, shiftCode: duty as string });
        }
        helpers.dutyController.getDutyByDateDuty.prefetch(queryArray);
    }

    const statusCode = queryRoute ? StatusCodes.OK : StatusCodes.NOT_FOUND;
    // const auth = getAuth(context.req);
    // const user = await clerkClient.users.getUser(auth.userId ?? '');

    return {
        props: {
            trpcState: helpers.dehydrate(),
            statusCode,
            queryString: queryRoute ?? ''
        }
    };
}

type ShiftTableOutputProps = InferGetServerSidePropsType<
    typeof getServerSideProps
>;

function ShiftTableOutput(props: ShiftTableOutputProps) {
    const { statusCode, queryString } = props;

    if (statusCode !== StatusCodes.OK)
        return <Custom404 statusCode={statusCode} />;

    const queryArray = queryString
        .toString()
        .split('&')
        .map((d) => {
            const [date, shiftCode] = d.split('=');
            return { date: date as string, shiftCode: shiftCode as string };
        });

    const {
        data: shiftData,
        isLoading: shiftsLoading,
        error: shiftsError
    } = api.dutyController.getDutyByDateDuty.useQuery(queryArray);

    if (shiftsLoading) return <p>Loading...</p>;
    if (shiftsError) return <p>Error</p>;

    return (
        <>
            <PageTitle>所查詢更表</PageTitle>
            <DayDetailTable columns={DayDetailColumn} data={shiftData} />
        </>
    );
}

export default ShiftTableOutput;
