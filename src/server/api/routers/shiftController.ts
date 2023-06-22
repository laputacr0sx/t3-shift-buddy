import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { sevenShiftRegex } from "~/lib/regex";

const dutyInputRegExValidator =
  /((?:1|3|5|6)(?:[0-5])(?:\d))|((?:(?:[A-Z])(?:1[3|4|5]|7[1|5]))(?:1|3|5|6)(?:[0-5])(?:\d)(?:\w?)|(?:9|8)(?:\d{5})(?:\w?))/;

export const getShiftRouter = createTRPCRouter({
  getShiftGivenDutyNumber: publicProcedure
    .input(
      z.object({
        duty: z.string().regex(dutyInputRegExValidator, "invalid duty input"),
      })
    )
    .query(({ input, ctx }) => {
      const resultShift = ctx.prisma.shifts.findMany({
        where: { dutyNumber: { endsWith: input.duty } },
      });

      return resultShift;
    }),
  getWeekShift: publicProcedure
    .input(
      z.object({
        shiftArray: z.string().regex(sevenShiftRegex).array().length(7),
      })
    )
    .query(({ input, ctx }) => {
      return;
    }),
});
