import { TRPCError } from '@trpc/server';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const timetableControllerRouter = createTRPCRouter({
    getAllTimetables: publicProcedure.query(async ({ ctx }) => {
        const timetables = await ctx.prisma.timetable
            .findMany({
                orderBy: { dateOfEffective: 'desc' }
            })
            .catch(() => {
                throw new TRPCError({ code: 'BAD_REQUEST' });
            });

        return timetables;
    }),

    getAvailableTimetables: publicProcedure.query(async ({ ctx }) => {
        const timetables = await ctx.prisma.timetable.findMany({ where: {} });
        return timetables;
    })
});
