import PageTitle from '~/components/PageTitle';

import React from 'react';
import SevenSlotsSearchForm from '~/components/SevenSlotsSearchForm';
import { api } from '~/utils/api';
import TableLoading from '~/components/TableLoading';
import CalendarTest from '~/components/CalendarTest';
import DutyDetailsPDF from '~/components/DutyDetailsPDF';

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
            <CalendarTest />
        </>
    );
};

export default LandingPage;
