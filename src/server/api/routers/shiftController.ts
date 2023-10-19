import { TRPCError } from "@trpc/server/dist/error/TRPCError";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { dutyInputRegExValidator, sevenShiftRegex } from "~/utils/regex";

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

  getWholeWeekShiftWithPrefix: publicProcedure
    .input(
      z.object({
        shiftArray: z.string().regex(sevenShiftRegex).array().length(7),
      })
    )
    .query(async ({ input, ctx }) => {
      const resultShiftArray = await ctx.prisma.shifts.findMany({
        where: { dutyNumber: { in: input.shiftArray } },
      });

      const result = await ctx.prisma.weekPrefix.findMany({
        orderBy: { updatedAt: "desc" },
        take: 1,
      });

      if (!result)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "result not found",
        });

      return resultShiftArray;
    }),
});
