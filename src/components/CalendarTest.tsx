import type {
    GSTCResult,
    Config,
    Rows,
    Items
} from 'gantt-schedule-timeline-calendar';
import 'gantt-schedule-timeline-calendar/dist/style.css';
import { useEffect, useCallback } from 'react';
import type DeepState from 'deep-state-observer';

import type UGSTC from 'gantt-schedule-timeline-calendar';

type TGSTC = typeof UGSTC;

interface GanntRow {
    id: string;
    label: string;
}

let GSTC: TGSTC, gstc: GSTCResult, state: DeepState;

async function initializeGSTC(element: HTMLDivElement) {
    GSTC = (await import('gantt-schedule-timeline-calendar')).default;

    const rowsFromDB: GanntRow[] = [
        {
            id: '1',
            label: 'Row 1'
        },
        {
            id: '2',
            label: 'Row 2'
        }
    ];

    const itemsFromDB = [
        {
            id: '1',
            label: 'Item 1',
            rowId: '1',
            time: {
                start: GSTC.api.date('2024-03-30').startOf('day').valueOf(),
                end: GSTC.api.date('2024-03-30').endOf('day').valueOf()
            }
        }
    ];

    const columnsFromDB = [
        {
            id: 'id',
            label: 'ID',
            data: ({ row }: { row: GanntRow }) => GSTC.api.sourceID(row.id), // show original id (not internal GSTCID)
            sortable: ({ row }: { row: GanntRow }) =>
                Number(GSTC.api.sourceID(row.id)), // sort by id converted to number
            width: 80,
            header: {
                content: 'ID'
            }
        },
        {
            id: 'label',
            data: 'label',
            sortable: 'label',
            isHTML: false,
            width: 230,
            header: {
                content: 'Label'
            }
        }
    ];

    const config: Config = {
        licenseKey:
            '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',

        list: {
            columns: {
                data: GSTC.api.fromArray(columnsFromDB)
            },
            rows: GSTC.api.fromArray(rowsFromDB)
        },
        chart: {
            items: GSTC.api.fromArray(itemsFromDB)
        }
    };

    state = GSTC.api.stateFromConfig(config);

    gstc = GSTC({
        element,
        state
    });
}

export default function CalendarTest() {
    const callback = useCallback(async (element: HTMLDivElement) => {
        if (element) await initializeGSTC(element);
    }, []);

    useEffect(() => {
        return () => {
            if (gstc) {
                gstc.destroy();
            }
        };
    }, []);

    function updateFirstRow() {
        if (!GSTC || !state) return;
        state.update(
            `config.list.rows.${GSTC.api.GSTCID('0')}`,
            (row: GanntRow) => {
                row.label = 'Changed dynamically';
                return row;
            }
        );
    }

    <button onClick={updateFirstRow}>Change row 1 label</button>;
    return (
        <div className="container">
            <hr />
            <div id="gstc" ref={callback} />

            <style jsx global>{`
                html,
                body {
                    padding: 0;
                    margin: 0;
                    font-family: -apple-system, BlinkMacSystemFont, Segoe UI,
                        Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
                        Helvetica Neue, sans-serif;
                }

                * {
                    box-sizing: border-box;
                }
            `}</style>
        </div>
    );
}
