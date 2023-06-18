import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const updateShiftRouter = createTRPCRouter({
  createNextWeekPrefix: publicProcedure
    .input(z.object({ prefixes: z.string().array().max(7) }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.weekPrefix.create({ data: input.prefixes });
    }),
});
