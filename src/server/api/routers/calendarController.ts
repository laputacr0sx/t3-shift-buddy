import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { dayDetailSchema } from "../../../utils/customTypes";

import { getICSObject } from "~/utils/helper";
import { put } from "@vercel/blob";

export const calendarControllerRouter = createTRPCRouter({
  transformToEvents: publicProcedure
    .input(dayDetailSchema.array())
    .query(async ({ input }) => {
      const calendar = await getICSObject(input);

      try {
        console.log(calendar);

        return put("ics.ics", calendar, {
          access: "public",
          addRandomSuffix: false,
        });
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify(err), { status: 500 });
      }
    }),
});
