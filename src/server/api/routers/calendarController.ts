import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  convertMonthNumber,
  convertICSEventsToBlob,
  getICSObject,
  staffBlobURI,
  getWebICSEvents,
  convertToICSEvents,
} from "~/utils/helper";

import axios, { type AxiosError } from "axios";
import { put } from "@vercel/blob";
import * as icalParser from "node-ical";
import { createEvents, type EventAttributes } from "ics";
import moment from "moment";
import { TRPCError } from "@trpc/server";
import { dayDetailSchema, userPrivateMetadataSchema } from "~/utils/zodSchemas";

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

      const oldICSEvents = convertToICSEvents(webICSEvents);

      const combinedICSEvents = oldICSEvents.reduce<EventAttributes[]>(
        (allEvents, currOldEvent) => {
          const legitOldDate = convertMonthNumber(
            currOldEvent.start,
            "subtract"
          );
          const dateOfOldEvent = moment(legitOldDate);

          const eventOnSameDate = updatedICSEvents.find((updateEvent) => {
            const legitUpdateDate = convertMonthNumber(
              updateEvent.start,
              "subtract"
            );
            const dateOfUpdatedEvent = moment(legitUpdateDate);

            return dateOfOldEvent.isSame(dateOfUpdatedEvent, "day");
          });

          if (typeof eventOnSameDate !== "undefined") {
            allEvents.push(eventOnSameDate);
            return allEvents;
          }

          allEvents.push(currOldEvent);

          return allEvents;
        },
        []
      );

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
