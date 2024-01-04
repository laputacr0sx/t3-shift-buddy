import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  convertICSEventsToBlob,
  getICSObject,
  staffBlobURI,
  getWebICSEvents,
  convertToICSEvents,
  convertMonthNumber,
} from "~/utils/helper";

import axios, { type AxiosError } from "axios";
import { put } from "@vercel/blob";
import * as icalParser from "node-ical";

import { TRPCError } from "@trpc/server";
import { dayDetailSchema, userPrivateMetadataSchema } from "~/utils/zodSchemas";
import { DateArray, EventAttributes } from "ics";
import moment from "moment";

export const calendarControllerRouter = createTRPCRouter({
  transformToEvents: publicProcedure
    .input(dayDetailSchema.array())
    .query(async ({ input }) => {
      const calEvents = getICSObject(input);
      const blob = await convertICSEventsToBlob(calEvents);

      try {
        return put("602949.ics", blob, {
          access: "public",
          addRandomSuffix: false,
        });
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify(err), { status: 500 });
      }
    }),

  getCurrentEvents: protectedProcedure
    .input(dayDetailSchema.array())
    .query(async ({ input, ctx }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      }
      const user = ctx.user;
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User Not Found" });
      }

      const metadata = user.privateMetadata;
      if (!metadata) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No metadata found",
        });
      }

      const { staffId } = userPrivateMetadataSchema.parse(metadata);
      console.log(staffId);

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

      const combinedICSEvents = oldICSEvents.reduce<EventAttributes[]>(
        (allEvents, currOldEvent) => {
          const legitOldDate = moment(
            convertMonthNumber(currOldEvent.start, "subtract")
          );

          const eventsOnSameDate = updatedICSEvents.filter((updateEvent) => {
            const legitUpdateDate = moment(
              convertMonthNumber(updateEvent.start, "subtract")
            );

            return legitOldDate.isSame(legitUpdateDate);
          });
          console.log(eventsOnSameDate);

          console.log(currOldEvent);
          if (eventsOnSameDate.length > 0) {
            for (const event of eventsOnSameDate) {
              currOldEvent = event as EventAttributes & {
                end: DateArray;
              };
            }

            console.log(currOldEvent);
          }

          console.log(currOldEvent.start);

          allEvents.push(currOldEvent);

          console.log(allEvents);
          return allEvents;
        },
        []
      );

      console.log(combinedICSEvents);

      // const awaitingEventBlob = convertICSEventsToBlob([
      //   ...oldICSEvents,
      //   ...updatedICSEvents,
      // ]);
      const awaitingEventBlob = convertICSEventsToBlob(combinedICSEvents);

      const eventsBlob = await awaitingEventBlob;

      try {
        return put(`${staffId}.ics`, eventsBlob, {
          access: "public",
          addRandomSuffix: false,
        });
      } catch (err) {
        throw new TRPCError({
          code: "PARSE_ERROR",
          message: "error parsing calendar to blob",
        });
        // return new Response(JSON.stringify(err), { status: 500 });
      }
    }),
});
