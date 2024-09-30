import { TRPCError } from '@trpc/server';
import {
    clerkMetaProcedure,
    createTRPCRouter,
    protectedProcedure
} from '~/server/api/trpc';
import { clerkClient } from '@clerk/nextjs';
import { userPrivateMetadataSchema, usersSchema } from '~/utils/zodSchemas';

export const userControllerRouter = createTRPCRouter({
    createUsers: protectedProcedure
        .input(usersSchema)
        .mutation(async ({ input }) => {
            return clerkClient.users.createUser(input);
        }),

    setUserMetadata: protectedProcedure
        .input(userPrivateMetadataSchema)
        .mutation(({ ctx, input }) => {
            const user = ctx.user;
            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'User Not Found'
                });
            }

            return clerkClient.users.updateUserMetadata(user.id, {
                privateMetadata: {
                    ...input
                }
            });
        }),

    getUserMetadata: clerkMetaProcedure.query(({ ctx }) => {
        return ctx.clerkMeta;
    })
});
