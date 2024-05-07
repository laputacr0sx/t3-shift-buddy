import PageTitle from '~/components/PageTitle';
import SevenSlotsSearchForm from '~/components/SevenSlotsSearchForm';
import TableLoading from '~/components/TableLoading';
import { api } from '~/utils/api';

const LandingPage = () => {
    const {
        data: weekDetails,
        isLoading: weekDetailsLoading,
        error: weekDetailsError
    } = api.timetableController.getSuitableTimetables.useQuery();

    if (weekDetailsLoading) return <TableLoading />;
    if (weekDetailsError) return <>Something Went Wrong</>;

    return (
        <>
            <PageTitle>出更易</PageTitle>
            <SevenSlotsSearchForm defaultData={weekDetails} />
        </>
    );
};

// eslint-disable-next-line @typescript-eslint/require-await
// export async function getServerSideProps(context: GetServerSidePropsContext) {
//     const auth = getAuth(context.req);
//
//     const ssgHelper = createServerSideHelpers({
//         router: appRouter,
//         ctx: createContextInner({ auth, user: null }),
//         transformer: superjson
//     });
//     // await ssgHelper.timetableController.getSuitableTimetables.prefetch();
//
//     return { props: { testing: 'hi' } };
//     // trpcState: ssgHelper.dehydrate()
// }

export default LandingPage;
