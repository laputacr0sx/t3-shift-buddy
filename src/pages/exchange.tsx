import React from 'react';
import { ExchangeColumn } from '~/components/Exchange/ExchangeColumn';
import { VerticalExchangeTable } from '~/components/Exchange/VerticalExchangeTable';

import ExchangeForm from '~/components/ExchangeForm';
import PageTitle from '~/components/PageTitle';
import { autoPrefix } from '~/utils/helper';

function Exchange() {
    return (
        <div>
            <PageTitle>調更易</PageTitle>
            <ExchangeForm />
            <VerticalExchangeTable
                columns={ExchangeColumn}
                data={[
                    {
                        name: 'test',
                        staffId: '6029XX',
                        grade: 'G50',
                        weekNumber: '19',
                        exchangeDetails: {},
                        rowSequence: 'A2'
                    }
                ]}
                daysDetails={autoPrefix(true)}
            />
        </div>
    );
}

export default Exchange;
