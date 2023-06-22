import { z } from "zod";
import { prefixRegex } from "~/lib/regex";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const prefixControllerRouter = createTRPCRouter({
  getCurrentPrefix: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.weekPrefix.findMany({
      orderBy: { createdAt: "desc" },
      take: 1,
    });
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
    .query(({ input, ctx }) => {
      return ctx.prisma.weekPrefix.findFirstOrThrow({
        where: { weekNumber: input.weekNumber },
      });
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
    .mutation(({ input, ctx }) => {
      return ctx.prisma.weekPrefix.create({ data: { ...input } });
    }),
});
