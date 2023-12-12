import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const timetableControllerRouter = createTRPCRouter({
    getAllTimetables: publicProcedure.query(async ({ ctx }) => {
        const timetables = await ctx.prisma.timetable
            .findMany({
                where: {
                    isSpecial: false,
                    dateOfEffective: {
                        lte: new Date()
                    },
                    createdAt: {}
                },
                orderBy: { dateOfEffective: 'asc' }
            })
            // .then((timetables) => {
            //   return timetables.filter(({ prefix }) => prefix.endsWith("75"));
            // })
            .catch(() => {
                throw new TRPCError({ code: 'BAD_REQUEST' });
            });

        return timetables;
    })
});
