import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  addOneToMonthNumber,
  convertICSEventsToBlob,
  getChineseLocation,
  getICSObject,
  staffBlobURI,
} from "~/utils/helper";

import axios, { AxiosError } from "axios";
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

      console.log(webICSEventString);

      function getWebICSEvents(
        webEvents: icalParser.CalendarResponse
      ): icalParser.VEvent[] {
        const events = [];
        for (const e in webEvents) {
          if (webEvents.hasOwnProperty(e)) {
            const ev = webEvents[e];
            if (!ev) continue;
            if (ev.type == "VEVENT") {
              events.push(ev);
            }
          }
        }
        return events;
      }

      function convertToICSEvents(
        webICSEvents: icalParser.VEvent[]
      ): EventAttributes[] {
        return webICSEvents.map<EventAttributes>((icsEvent) => {
          const start = moment(icsEvent.start).toArray().splice(0, 5);
          const end = moment(icsEvent.end).toArray().splice(0, 5);
          const dutyNumber = icsEvent.summary;
          const bNL = icsEvent.location;
          const description = icsEvent.description;

          return {
            start: addOneToMonthNumber(start),
            startInputType: "local",
            end: addOneToMonthNumber(end),
            endInputType: "local",
            title: dutyNumber,
            description: description,
            location: getChineseLocation(bNL),
            busyStatus: "BUSY",
            productId: "calendar",
            classification: "PUBLIC",
            sequence: 0,
          } as EventAttributes;
        });
      }

      const webICSEvents = getWebICSEvents(webICSEventString);

      const latestICSEvents = getICSObject(input);

      const ICSEvents = convertToICSEvents(webICSEvents);

      const awaitingEventBlob = convertICSEventsToBlob([
        ...latestICSEvents,
        ...ICSEvents,
      ]);

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