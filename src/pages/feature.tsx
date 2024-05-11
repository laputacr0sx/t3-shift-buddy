import React, { type ReactElement } from 'react';
import DynamicExchangeForm from '~/components/dynamicExchangeForm';
import { type NextPageWithLayout } from './_app';
import Layout from '~/components/ui/layouts/AppLayout';
import PageTitle from '~/components/PageTitle';
import BestExchangeForm from '~/components/Exchange/BestExchangeForm';

const Feature: NextPageWithLayout = () => {
    return (
        <>
            <PageTitle>調更易</PageTitle>
            {/* <DynamicExchangeForm /> */}
            <BestExchangeForm />
        </>
    );
};

Feature.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default Feature;
