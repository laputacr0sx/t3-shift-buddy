import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prefixRegex } from "~/utils/regex";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const prefixControllerRouter = createTRPCRouter({
  getAllAvailablePrefixes: publicProcedure.query(async ({ ctx }) => {
    const all159Shifts = await ctx.prisma.shift.findMany({
      where: {
        dutyNumber: {
          contains: "159",
        },
      },
    });
    const result = all159Shifts.map(
      ({ dutyNumber }) => dutyNumber.match(prefixRegex)?.[0]
    );
    return result;
  }),

  getCurrentPrefix: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.weekPrefix.findMany({
      orderBy: { updatedAt: "desc" },
      take: 1,
    });

    if (!result?.[0])
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "result not found",
      });

    return result?.[0];
  }),

  getPrefixGivenWeekNumber: publicProcedure
    .input(
      z.object({
        weekNumber: z
          .number()
          .max(53, "Weeknumber cannot be greater than 52")
          .min(1, "This minimum Weeknumber is 1"),
      })
    )
    .query(async ({ input: { weekNumber }, ctx }) => {
      const currentPrefix = await ctx.prisma.weekPrefix.findFirst({
        where: { weekNumber: weekNumber },
      });

      const latestResult = await ctx.prisma.weekPrefix.findFirstOrThrow({
        orderBy: { updatedAt: "desc" },
        take: 1,
      });

      return {
        result: currentPrefix ?? latestResult,
        error: !currentPrefix
          ? new TRPCError({
              code: "NOT_FOUND",
              message: `WeekPrefix with weekNumber ${weekNumber} not found`,
            })
          : null,
      };
    }),

  createNextWeekPrefix: publicProcedure
    .input(
      z.object({
        prefixes: z
          .string()
          .regex(prefixRegex)
          .array()
          .length(7, "A week only contains 7 prefixes"),
        weekNumber: z
          .number()
          .max(53, "Weeknumber cannot be greater than 52")
          .min(1, "This minimum Weeknumber is 1"),
      })
    )

    .mutation(async ({ input, ctx }) => {
      const relatedWeekPrefix = await ctx.prisma.weekPrefix.findUnique({
        where: { weekNumber: input.weekNumber },
      });

      return relatedWeekPrefix
        ? await ctx.prisma.weekPrefix.update({
            where: { weekNumber: input.weekNumber },
            data: {
              prefixes: input.prefixes,
            },
          })
        : await ctx.prisma.weekPrefix.create({
            data: { ...input },
          });
    }),
});
