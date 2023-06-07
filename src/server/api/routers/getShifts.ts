import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const getShiftRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.shifts.findMany({ take: 10 });
  }),
});
