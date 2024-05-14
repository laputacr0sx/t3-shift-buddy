import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { getSelectedShiftsString, tableCopyHandler } from '~/utils/helper';
import { type DayDetail } from '~/utils/customTypes';

import { useUser } from '@clerk/nextjs';

import { atcb_action } from 'add-to-calendar-button';

import { api } from '~/utils/api';

type TableCopyButtonsProps<TData> = {
    isSomeRowSelected: boolean;
    selectedShifts: TData[];
};

function TableCopyButtons({
    selectedShifts
}: TableCopyButtonsProps<DayDetail>) {
    const user = useUser();
    // console.log(user.user?.id);

    const completeShiftsString = getSelectedShiftsString(selectedShifts);
    const encodedShiftsStringURI = encodeURIComponent(completeShiftsString);
    const numberOfSelectedShifts = selectedShifts.length;

    const {
        data: calendarData,
        isLoading: calendarLoading,
        error: calendarError,
        refetch: fetchCalendar
    } = api.calendarController.getCurrentEvents.useQuery(selectedShifts, {
        enabled: false,
        refetchOnWindowFocus: false
    });

    return (
        <>
            <div className="flex items-center justify-around gap-4">
                {(user.user?.id === 'user_2Z48mfJ1WNbgJygUNvP7QcDI24K' ||
                    user.user?.id === 'user_2WeQPNGu9T7ZDKJj0HqqplTnKz8') && (
                    <Button
                        onClick={async () => {
                            await fetchCalendar();
                        }}
                    >
                        Update Events in Calendar
                    </Button>
                )}
                <Button
                    className="my-2 self-center align-middle font-light"
                    variant={'secondary'}
                    disabled={!numberOfSelectedShifts}
                    onClick={() => tableCopyHandler(selectedShifts)}
                >
                    {!!numberOfSelectedShifts ? (
                        <p className="tracking-widest">
                            <span>複製</span>
                            <span className="font-mono font-extrabold">
                                {`${numberOfSelectedShifts}`}
                            </span>
                            <span>更資料</span>
                        </p>
                    ) : (
                        '未選取任何更份'
                    )}
                </Button>
                {user.isSignedIn && !calendarLoading && !calendarError ? (
                    <>
                        <Button
                            className="my-2 self-center align-middle font-light"
                            variant={'secondary'}
                            disabled={calendarLoading && calendarData}
                            onClick={(event) => {
                                event.preventDefault();

                                atcb_action({
                                    subscribe: true,
                                    startDate: '1992-07-04',
                                    icsFile: calendarData.url,
                                    name: 'ICS file',
                                    options: [
                                        'Apple',
                                        'Google',
                                        'Microsoft365',
                                        'iCal'
                                    ],
                                    timeZone: 'currentBrowser'
                                });
                            }}
                        >
                            {calendarLoading ? 'loading events...' : '訂閱日厝'}
                        </Button>
                    </>
                ) : null}
            </div>
            <Link
                href={`whatsapp://send?text=${encodedShiftsStringURI}`}
                className="flex flex-row self-center align-middle text-emerald-700 dark:text-emerald-300"
            >
                <MessageCircle className="m-2 h-4 w-4 self-center" />
                <p className={'self-center text-center text-xs '}>
                    開啟WhatsApp
                </p>
            </Link>
        </>
    );
}

export default TableCopyButtons;
