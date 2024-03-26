import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
    clerkMetaProcedure,
    createTRPCRouter,
    protectedProcedure
} from '~/server/api/trpc';

export const sequenceControllerRouter = createTRPCRouter({
    demoMutateSequence: clerkMetaProcedure
        .input(
            z.object({
                sequence: z.string().array(),
                sequenceId: z.string()
            })
        )
        .mutation(
            async ({
                ctx: {
                    prisma,
                    clerkMeta: { staffId },
                    user
                },
                input: { sequence, sequenceId }
            }) => {
                if (!staffId) throw new TRPCError({ code: 'NOT_FOUND' });

                const rosterId = sequenceId.slice(0, 8);

                const upsertSequence = await prisma.sequence.upsert({
                    where: {
                        id: sequenceId,
                        staffId: staffId
                    },
                    update: { dutyNumbers: sequence, staffId: staffId },
                    create: {
                        id: sequenceId,
                        dutyNumbers: sequence,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        Roster: {
                            connectOrCreate: {
                                create: { id: rosterId, publisherId: staffId },
                                where: { id: rosterId }
                            }
                        },
                        Staff: {
                            connectOrCreate: {
                                create: {
                                    id: staffId,
                                    dateOfJoin: new Date(),
                                    name: user.id,
                                    email: ''
                                },
                                where: { id: staffId }
                            }
                        }
                    }
                });

                return upsertSequence;
            }
        ),

    getSequence: clerkMetaProcedure
        .input(z.object({ sequenceId: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.sequence.findUniqueOrThrow({
                where: { id: input.sequenceId, staffId: ctx.clerkMeta.staffId }
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
