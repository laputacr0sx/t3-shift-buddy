import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import type { DayDetail } from '~/utils/customTypes';

import { completeShiftNameRegex, dayOffRegex, proShiftNameRegex } from '~/utils/regex';

export const dutyControllerRouter = createTRPCRouter({
    getDutiesBySequence: publicProcedure
        .input(z.string().regex(completeShiftNameRegex, '更號不正確').array())
        .query(async ({ ctx, input }) => {
            return ctx.prisma.duty.findMany({
                where: { dutyNumber: { in: input } }
            });
        }),

    getDutyByDutyNumber: publicProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            const foundDuty = await ctx.prisma.duty.findUnique({
                where: { dutyNumber: input }
            });
            if (!foundDuty) throw new TRPCError({ code: 'NOT_FOUND' });
            return foundDuty;
        }),

    getDutyByDateDuty: publicProcedure
        .input(
            z
                .object({
                    date: z.string().regex(/\d{8}/gim),
                    shiftCode: z.string().regex(proShiftNameRegex)
                })
                .array()
        )
        .query(async ({ ctx, input }) => {
            const dutyInQuery = input.map((obj) => obj.shiftCode);

            const foundDuty = await ctx.prisma.duty.findMany({
                where: { dutyNumber: { in: dutyInQuery } }
            });

            return input.reduce<DayDetail[]>(
                (accumulatedDays, day) => {
                    if (day.shiftCode.match(dayOffRegex)) {
                        accumulatedDays.push({
                            date: day.date,
                            title: day.shiftCode,
                            dutyNumber: day.shiftCode
                        } as DayDetail);
                    }

                    const temp = foundDuty.filter((duty) =>
                        duty.dutyNumber.match(day.shiftCode)
                    )[0];

                    if (temp)
                        accumulatedDays.push({
                            ...temp,
                            date: day.date,
                            title: temp.dutyNumber,
                            id: '',
                            staffId: ''
                        } as DayDetail);

                    return accumulatedDays;
                },
                []
            );
        })
});
