import {
    clerkMetaProcedure,
    createTRPCRouter,
    publicProcedure
} from '~/server/api/trpc';
import {
    convertICSEventsToBlob,
    getICSObject,
    staffBlobURI,
    getWebICSEvents,
    convertToICSEvents
} from '~/utils/helper';

import axios, { type AxiosError } from 'axios';
import { put } from '@vercel/blob';
import * as icalParser from 'node-ical';

import { TRPCError } from '@trpc/server';
import { dayDetailSchema } from '~/utils/zodSchemas';

export const calendarControllerRouter = createTRPCRouter({
    transformToEvents: publicProcedure
        .input(dayDetailSchema.array())
        .query(async ({ input }) => {
            const calEvents = getICSObject(input);
            const blob = await convertICSEventsToBlob(calEvents);

            try {
                return put('602949.ics', blob, {
                    access: 'public',
                    addRandomSuffix: false
                });
            } catch (err) {
                console.error(err);
                return new Response(JSON.stringify(err), { status: 500 });
            }
        }),

    getCurrentEvents: clerkMetaProcedure
        .input(dayDetailSchema.array())
        .query(async ({ input, ctx }) => {
            const staffId = ctx.clerkMeta.staffId;

            const webICSEventString = await axios
                .get(staffBlobURI(staffId))
                .then((res) => icalParser.parseICS(res.data as string))
                .catch((err: AxiosError) => {
                    console.error(err);
                    return {} as icalParser.CalendarResponse;
                    // throw new TRPCError({
                    //   code: "BAD_REQUEST",
                    //   message: err.message,
                    // });
                });

            const webICSEvents = getWebICSEvents(webICSEventString);

            const updatedICSEvents = getICSObject(input);
            console.log(updatedICSEvents);

            const oldICSEvents = convertToICSEvents(webICSEvents);
            console.log(oldICSEvents);

            // const combinedICSEvents = oldICSEvents.reduce<EventAttributes[]>(
            //   (allEvents, currOldEvent) => {
            //     const legitOldDate = convertMonthNumber(
            //       currOldEvent.start,
            //       "subtract"
            //     );
            //     const dateOfOldEvent = moment(legitOldDate);
            //     console.log(dateOfOldEvent.date());

            //     const eventsOnSameDate = updatedICSEvents.filter((updateEvent) => {
            //       const legitUpdateDate = convertMonthNumber(
            //         updateEvent.start,
            //         "subtract"
            //       );
            //       const dateOfUpdatedEvent = moment(legitUpdateDate);

            //       return dateOfOldEvent.isSame(dateOfUpdatedEvent);
            //     });
            //     console.log(eventsOnSameDate);

            //     if (eventsOnSameDate.length > 0) {
            //       for (const event of eventsOnSameDate) {
            //         allEvents.push(event);
            //       }
            //       console.log(allEvents);
            //       return allEvents;
            //     }

            //     allEvents.push(currOldEvent);

            //     console.log(allEvents);
            //     return allEvents;
            //   },
            //   []
            // );

            // console.log(combinedICSEvents);

            const awaitingEventBlob = convertICSEventsToBlob([
                ...oldICSEvents,
                ...updatedICSEvents
            ]);
            // const awaitingEventBlob = convertICSEventsToBlob(combinedICSEvents);
            console.log(awaitingEventBlob);

            const eventsBlob = await awaitingEventBlob;

            try {
                return put(`${staffId}.ics`, eventsBlob, {
                    access: 'public',
                    addRandomSuffix: false
                });
            } catch (err) {
                throw new TRPCError({
                    code: 'PARSE_ERROR',
                    message: 'error parsing calendar to blob'
                });
                // return new Response(JSON.stringify(err), { status: 500 });
            }
        })
});
