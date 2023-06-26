import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { dutyInputRegExValidator, sevenShiftRegex } from "~/lib/regex";

export const shiftControllerRouter = createTRPCRouter({
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
      const resultShiftArray = ctx.prisma.shifts.findMany({
        where: { dutyNumber: { in: input.shiftArray } },
      });

      return resultShiftArray;
    }),
});
