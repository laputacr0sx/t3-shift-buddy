import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { clerkClient } from '@clerk/nextjs';
import { userPrivateMetadataSchema, usersSchema } from '~/utils/zodSchemas';

export const userControllerRouter = createTRPCRouter({
    createUsers: protectedProcedure
        .input(usersSchema)
        .mutation(async ({ input, ctx }) => {
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
                    staffId: input.staffId,
                    row: input.row
                }
            });
        }),

    getUserMetadata: protectedProcedure.query(async ({ ctx }) => {
        const user = ctx.user;
        if (!user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'User Not Found'
            });
        }

        const metadata = await clerkClient.users
            .getUser(user.id)
            .then((user) => user.privateMetadata);

        const validMetadata = userPrivateMetadataSchema.safeParse(metadata);

        if (!validMetadata.success) {
            throw new TRPCError({
                code: 'PARSE_ERROR',
                message:
                    'Invalid Metadata in database, please update your information. 🙏🏿'
            });
        }

        return validMetadata.data;
    })
});
