import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';

import superjson from 'superjson';
import { ZodError } from 'zod';

import { prisma } from '~/server/db';

// Clerk implementation //
import {
    getAuth,
    type User,
    type SignedInAuthObject,
    type SignedOutAuthObject,
    clerkClient
} from '@clerk/nextjs/server';
import { userPrivateMetadataSchema } from '~/utils/zodSchemas';
import { type UserPrivateMetadata } from '~/utils/customTypes';

type CreateContextOptions = {
    auth: SignedInAuthObject | SignedOutAuthObject;
    user: User | null;
    clerkMeta: null;
};

export const createContextInner = (opts: CreateContextOptions) => {
    return {
        auth: opts.auth,
        user: opts.user,
        prisma,
        clerkMeta: null
    };
};

export const createContext = (opts: CreateNextContextOptions) => {
    const { req } = opts;
    const authSession = getAuth(req);
    return createContextInner({
        auth: authSession,
        user: null,
        clerkMeta: null
    });
};

export type Context = ReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null
            }
        };
    }
});

// check if the user is signed in, otherwise throw a UNAUTHORIZED CODE
const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
    if (!ctx.auth.userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const user = ctx.auth.userId
        ? await clerkClient.users.getUser(ctx.auth.userId)
        : null;

    return next({
        ctx: {
            auth: ctx.auth,
            user: user
        }
    });
});

const getClerkMeta = t.middleware(async ({ ctx, next }) => {
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

    console.log(metadata);

    const validMetadata = userPrivateMetadataSchema.safeParse(metadata);

    if (!validMetadata.success) {
        throw new TRPCError({
            code: 'PARSE_ERROR',
            message:
                'Invalid Metadata in database, please update your information. 🙏🏿'
        });
    }

    const staffMeta = validMetadata.success
        ? validMetadata.data
        : ({ row: '', staffId: '', weekNumber: 0 } as UserPrivateMetadata);

    // const staffMeta = metadata;

    return next({
        ctx: {
            auth: ctx.auth,
            user: user,
            clerkMeta: staffMeta
        }
    });
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

export const clerkMetaProcedure = t.procedure
    .use(enforceUserIsAuthed)
    .use(getClerkMeta);
