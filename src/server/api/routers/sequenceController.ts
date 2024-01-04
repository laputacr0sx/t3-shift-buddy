import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure
} from '~/server/api/trpc';

export const sequenceControllerRouter = createTRPCRouter({
    getSequence: protectedProcedure
        .input(z.object({ sequenceId: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.sequence.findUniqueOrThrow({
                where: { id: input.sequenceId }
            });
        })
});
