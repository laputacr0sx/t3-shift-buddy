import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { workLocation } from '~/utils/customTypes';
import { dutyInputRegExValidator } from '~/utils/regex';

export const databaseControllerRouter = createTRPCRouter({
    createManyShifts: publicProcedure
        .input(
            z.array(
                z.object({
                    dutyNumber: z
                        .string()
                        .regex(dutyInputRegExValidator, 'invalid dutyNumber'),
                    bNL: z.enum(workLocation, {
                        invalid_type_error: 'workLocation not supported yet'
                    }),
                    bNT: z.string(),
                    bFT: z.string(),
                    bFL: z.enum(workLocation, {
                        invalid_type_error: 'workLocation not supported yet'
                    }),
                    duration: z.string(),
                    remarks: z.string()
                })
            )
        )
        .mutation(({ input, ctx }) => {
            return ctx.prisma.duty.createMany({ data: input });
        }),

    createShift: publicProcedure
        .input(
            z.object({
                dutyNumber: z
                    .string()
                    .regex(dutyInputRegExValidator, 'invalid dutyNumber'),
                bNL: z.enum(workLocation, {
                    invalid_type_error: 'workLocation not supported yet'
                }),
                bNT: z.string(),
                bFT: z.string(),
                bFL: z.enum(workLocation, {
                    invalid_type_error: 'workLocation not supported yet'
                }),
                duration: z.string(),
                remarks: z.string()
            })
        )
        .mutation(({ input, ctx }) => {
            return ctx.prisma.duty.create({ data: input });
        })
});
