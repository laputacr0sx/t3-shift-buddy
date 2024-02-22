import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const rosterControllerRouter = createTRPCRouter({
    createRoster: protectedProcedure
        // .input(z.object({}))
        .mutation(async ({ ctx }) => {
            return ctx.prisma.roster.create({
                data: {
                    Sequence: {
                        create: [
                            {
                                id: 'Y2024W01A86',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                dutyNumbers: [
                                    '149',
                                    '150',
                                    '151',
                                    '602',
                                    '153',
                                    '154',
                                    'RD'
                                ]
                            }
                        ]
                    },
                    Timetables: { connect: { toc: 'EAL1200F' } },
                    id: 'Y2024W1',
                    publishedAt: new Date('2023-12-06T00:00:00.0000Z'),
                    publisherId: '602949'
                }
            });
        }),
    getRosterByWeekId: protectedProcedure
        .input(z.object({ weekId: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.roster.findUnique({
                where: { id: input.weekId }
            });
        })
});
