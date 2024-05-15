import React from 'react';
import RegisterDayOffForm from '~/components/RegisterDayOffForm';
import { Separator } from '~/components/ui/separator';

function DayOffRegisterForm() {
    return (
        <div className="flex flex-col items-center justify-center gap-2 px-10 py-12">
            {/* <h1 className=" py-4 text-2xl"> */}
            <h1 className="justify-center py-2 text-center font-mono text-4xl font-semibold text-foreground">
                假期申請表
            </h1>
            <Separator className={'my-4'} />

            <div className="flex w-1/2 items-center justify-center">
                <RegisterDayOffForm />
            </div>
        </div>
    );
}

export default DayOffRegisterForm;
