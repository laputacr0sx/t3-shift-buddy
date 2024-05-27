import React from 'react';
import PageTitle from '~/components/PageTitle';
import RegisterDayOffForm from '~/components/RegisterDayOffForm';
import { Separator } from '~/components/ui/separator';

function DayOffRegisterForm() {
    return (
        <div className="flex flex-col items-center justify-center gap-2 px-10 py-12">
            <PageTitle>假期申請表</PageTitle>
            <Separator className={'my-4'} />
            <div className="flex w-1/2 items-center justify-center">
                <RegisterDayOffForm />
            </div>
        </div>
    );
}

export default DayOffRegisterForm;
