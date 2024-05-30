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

export default LandingPage;
