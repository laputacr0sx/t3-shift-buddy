import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

import AddToCalendarButtonCustom from './CustomAddToCalendarButton';

import { Button } from './ui/button';
import { type DayDetail } from '~/utils/customTypes';
import { getSelectedShiftsString, tableCopyHandler } from '~/utils/helper';

type TableCopyButtonsProps<TData> = {
    isAllRowSelected: boolean;
    isSomeRowSelected: boolean;
    selectedShifts: TData[];
    allShifts: TData[];
};

function TableCopyButtons({
    isAllRowSelected,
    selectedShifts,
    allShifts,
    isSomeRowSelected
}: TableCopyButtonsProps<DayDetail>) {
    // const user = useUser();
    // console.log(user.user?.id);

    const numberOfSelectedShifts = selectedShifts.length;
    const numberOfAllShifts = allShifts.length;

    const correspondingShifts = isSomeRowSelected ? selectedShifts : allShifts;

    const completeShiftsString = getSelectedShiftsString(selectedShifts);
    const encodedShiftsStringURI = encodeURIComponent(completeShiftsString);

    const countString =
        numberOfSelectedShifts === numberOfAllShifts ||
        numberOfSelectedShifts === 0
            ? '全部'
            : numberOfSelectedShifts.toString();
    // const {
    //     data: calendarData,
    //     isLoading: calendarLoading,
    //     error: calendarError,
    //     refetch: fetchCalendar
    // } = api.calendarController.getCurrentEvents.useQuery(selectedShifts, {
    //     enabled: false,
    //     refetchOnWindowFocus: false
    // });

    return (
        <>
            <div className="flex items-center justify-around gap-4">
                {/* {(user.user?.id === 'user_2Z48mfJ1WNbgJygUNvP7QcDI24K' || */}
                {/*     user.user?.id === 'user_2WeQPNGu9T7ZDKJj0HqqplTnKz8') && ( */}
                {/*     <Button */}
                {/*         onClick={async () => { */}
                {/*             await fetchCalendar(); */}
                {/*         }} */}
                {/*     > */}
                {/*         Update Events in Calendar */}
                {/*     </Button> */}
                {/* )} */}
                <Button
                    className="my-2 self-center align-middle font-light"
                    variant={'secondary'}
                    onClick={() => tableCopyHandler(correspondingShifts)}
                >
                    <p className="tracking-widest">
                        <span>複製</span>
                        <span className="font-mono font-extrabold">
                            {countString}
                        </span>
                        <span>更資料</span>
                    </p>
                </Button>
                <AddToCalendarButtonCustom tableData={correspondingShifts} />
                {/* {user.isSignedIn && !calendarLoading && !calendarError ? ( */}
                {/*     <> */}
                {/*         <Button */}
                {/*             className="my-2 self-center align-middle font-light" */}
                {/*             variant={'secondary'} */}
                {/*             disabled={calendarLoading && calendarData} */}
                {/*             onClick={(event) => { */}
                {/*                 event.preventDefault(); */}
                {/**/}
                {/*                 atcb_action({ */}
                {/*                     subscribe: true, */}
                {/*                     startDate: '1992-07-04', */}
                {/*                     icsFile: calendarData.url, */}
                {/*                     name: 'ICS file', */}
                {/*                     options: [ */}
                {/*                         'Apple', */}
                {/*                         'Google', */}
                {/*                         'Microsoft365', */}
                {/*                         'iCal' */}
                {/*                     ], */}
                {/*                     timeZone: 'currentBrowser' */}
                {/*                 }); */}
                {/*             }} */}
                {/*         > */}
                {/*             {calendarLoading ? 'loading events...' : '訂閱日厝'} */}
                {/*         </Button> */}
                {/*     </> */}
                {/* ) : null} */}
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
