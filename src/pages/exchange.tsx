import React, { type ReactElement } from 'react';

import ExchangeForm from '~/components/ExchangeForm';
import PageTitle from '~/components/PageTitle';
import Layout from '~/components/ui/layouts/AppLayout';

function Exchange() {
    return (
        <div>
            <PageTitle>調更易</PageTitle>
            <ExchangeForm />
        </div>
    );
}

Exchange.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default Exchange;
