import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

import { completeShiftNameRegex } from '~/utils/regex';

export const dutyControllerRouter = createTRPCRouter({
    getDutiesBySequence: publicProcedure
        .input(z.string().regex(completeShiftNameRegex, '更號不正確').array())
        .query(async ({ ctx, input }) => {
            const foundDuties = await ctx.prisma.duty.findMany({
                where: { dutyNumber: { in: input } }
                // select: { dutyNumber: true, bNT: true, bFT: true }
            });
            return foundDuties;
        }),

    getDutyByDutyNumber: publicProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            const foundDuty = await ctx.prisma.duty.findUnique({
                where: { dutyNumber: input }
            });
            if (!foundDuty) throw new TRPCError({ code: 'NOT_FOUND' });
            return foundDuty;
        })
});
