import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  addOneToMonthNumber,
  getChineseLocation,
  getICSObject,
} from "~/utils/helper";

import { dayDetailSchema } from "../../../utils/customTypes";

import axios from "axios";
import { put } from "@vercel/blob";
import * as icalParser from "node-ical";
import { type EventAttributes } from "ics";
import moment from "moment";
import { TRPCError } from "@trpc/server";

export const calendarControllerRouter = createTRPCRouter({
  transformToEvents: publicProcedure
    .input(dayDetailSchema.array())
    .query(async ({ input }) => {
      const calendar = await getICSObject(input);

      try {
        return put("602949.ics", calendar, {
          access: "public",
          addRandomSuffix: false,
        });
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify(err), { status: 500 });
      }
    }),

  getCurrentEvents: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.auth.userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    console.log(ctx.auth.user?.publicMetadata);

    const webICSEventString = await axios
      .get(
        `https://r4wbzko8exh5zxdl.public.blob.vercel-storage.com/${602949}.ics`
      )
      .then((res) => icalParser.parseICS(res.data as string));

    const getWebICSEvents = (webEvents: icalParser.CalendarResponse) => {
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
    };

    const convertToICSEvents = (webICSEvents: icalParser.VEvent[]) =>
      webICSEvents.map<EventAttributes>((icsEvent) => {
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

    const webICSEvents = getWebICSEvents(webICSEventString);
    const ICSEvents = convertToICSEvents(webICSEvents);
    return ICSEvents;
  }),
});
