import React from 'react';
import PageTitle from '~/components/PageTitle';
import BestExchangeForm from '~/components/Exchange/BestExchangeForm';
import {
    type GetServerSidePropsContext,
    type InferGetServerSidePropsType
} from 'next';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';
import { createContextInner } from '~/server/api/trpc';
import superjson from 'superjson';

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: createContextInner({ auth: null, user: null, clerkMeta: null }),
        transformer: superjson
    });

    // const auth = getAuth(context.req);
    // const user = await clerkClient.users.getUser(auth.userId ?? '');

    await helpers.timetableController.getSuitableTimetables.prefetch();

    return {
        props: {
            trpcState: helpers.dehydrate()
        }
    };
}

type ExchangePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Feature = (props: ExchangePageProps) => {
    return (
        <>
            <PageTitle>調更易</PageTitle>
            {/* <DynamicExchangeForm /> */}
            <BestExchangeForm />
        </>
    );
};

export default Feature;
