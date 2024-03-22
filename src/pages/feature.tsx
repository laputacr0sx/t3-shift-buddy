import React from 'react';
import DynamicExchangeForm from '~/components/dynamicExchangeForm';

const Feature = () => {
    return (
        <div>
            <h1 className="justify-center py-5 text-center text-4xl font-semibold text-foreground">
                調更易
            </h1>
            <DynamicExchangeForm />
        </div>
    );
};

export default Feature;
