import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
    clerkMetaProcedure,
    createTRPCRouter,
    protectedProcedure
} from '~/server/api/trpc';

export const sequenceControllerRouter = createTRPCRouter({
    demoGetSequence: protectedProcedure.query(async ({ ctx }) => {
        const sequence = await ctx.prisma.sequence.findUnique({
            where: { id: 'Y2024W1A86' }
        });

        return sequence;
    }),

    demoMutateSequence: clerkMetaProcedure
        .input(
            z.object({
                sequence: z.string().array(),
                rosterId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const staffId = ctx.clerkMeta.staffId;

            if (!staffId) throw new TRPCError({ code: 'NOT_FOUND' });

            const upsertSequence = await ctx.prisma.sequence.upsert({
                where: {
                    id: `${input.rosterId}${ctx.clerkMeta.row}`,
                    staffId: staffId
                },
                update: { dutyNumbers: input.sequence },
                create: {
                    id: `${input.rosterId}${ctx.clerkMeta.row}`,
                    dutyNumbers: input.sequence,
                    createdAt: new Date(),
                    updatedAt: new Date(),

                    Roster: { connect: { id: input.rosterId } },
                    Staff: { connect: { id: staffId } }
                }
            });

            return upsertSequence;
        }),

    getSequence: protectedProcedure
        .input(z.object({ sequenceId: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.sequence.findUniqueOrThrow({
                where: { id: input.sequenceId }
            });
        }),

    setIndividualSequence: protectedProcedure
        .input(z.object({}))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.sequence.upsert({
                where: {
                    id: 'Y2024W04A88',
                    staffId: '602949',
                    rosterId: 'Y2024W044'
                },
                update: { dutyNumbers: input },
                create: {
                    id: 'Y2024W04A88',
                    dutyNumbers: [''],
                    createdAt: new Date(),
                    updatedAt: new Date(),

                    Roster: { connect: { id: 'Y2024W04' } },
                    Staff: { connect: { id: '602949' } }
                }
            });
        })
});
