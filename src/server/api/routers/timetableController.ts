import { TRPCError } from '@trpc/server';
import moment from 'moment';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { getDateDetailFromId, getFitTimetable } from '~/utils/helper';

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
    }),
    getSuitableTimetables: publicProcedure.query(
        async ({ ctx: { prisma } }) => {
            const correspondingMoment = moment();
            const dateDetails = getDateDetailFromId(
                correspondingMoment.format(`[Y]Y[W]w`)
            );

            const timetables = await prisma.timetable
                .findMany({
                    orderBy: { dateOfEffective: 'desc' }
                })
                .catch(() => {
                    throw new TRPCError({ code: 'BAD_REQUEST' });
                });

            const datePrefix = getFitTimetable(timetables, dateDetails);

            return datePrefix;
        }
    )
});
