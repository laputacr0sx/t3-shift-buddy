import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure
} from '~/server/api/trpc';
import { userPrivateMetadataSchema } from '~/utils/zodSchemas';

export const userControllerRouter = createTRPCRouter({
    getUserMetadata: protectedProcedure.query(async ({ ctx, input }) => {
        await ctx.prisma.user.findUniqueOrThrow();
        return;
    }),
    setUserMetadata: protectedProcedure
        .input(userPrivateMetadataSchema)
        .mutation(() => {
            return;
        })
});
