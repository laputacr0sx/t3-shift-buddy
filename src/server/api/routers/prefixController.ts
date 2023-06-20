import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const prefixRegex = /(?:[A-Z])(?:1[3|4|5]|7[1|5])/i;

export const prefixControllerRouter = createTRPCRouter({
  getCurrentPrefix: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.weekPrefix.findMany({
      orderBy: { createdAt: "desc" },
      take: 1,
    });
  }),
  createNextWeekPrefix: publicProcedure
    .input(
      z.object({
        monday: z.string().regex(prefixRegex),
        tuesday: z.string().regex(prefixRegex),
        wednesday: z.string().regex(prefixRegex),
        thursday: z.string().regex(prefixRegex),
        friday: z.string().regex(prefixRegex),
        saturday: z.string().regex(prefixRegex),
        sunday: z.string().regex(prefixRegex),
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
