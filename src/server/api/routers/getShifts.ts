import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const getShiftRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.shifts.findMany({ take: 10 });
  }),

  getPrefix: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.shifts.findMany({
      where: {
        dutyNumber: {
          contains: "101",
        },
      },
      select: {
        dutyNumber: true,
      },
    });
  }),

  findShift: publicProcedure
    .input(z.object({ duty: z.string() }))
    .query(({ input, ctx }) => {
      const resultShift = ctx.prisma.shifts.findMany({
        where: { dutyNumber: { endsWith: input.duty } },
      });

      return resultShift;
    }),
});
