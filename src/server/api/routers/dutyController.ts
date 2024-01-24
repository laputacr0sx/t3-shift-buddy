import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

import { completeShiftNameRegex } from '~/utils/regex';

export const dutyControllerRouter = createTRPCRouter({
    getDutyByDutynumber: publicProcedure
        .input(z.string().regex(completeShiftNameRegex, '更號不正確').array())
        .query(async ({ ctx, input }) => {
            const foundDuty = await ctx.prisma.duty.findMany({
                where: { dutyNumber: { in: input } },
                select: { dutyNumber: true, bNT: true, bFT: true }
            });
            return foundDuty;
        })
});
