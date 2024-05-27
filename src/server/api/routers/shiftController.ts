import { TRPCError } from '@trpc/server';

import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { getResponseWithType } from '~/utils/helper';

import { completeShiftNameRegex } from '~/utils/regex';

import { Ratelimit } from '@upstash/ratelimit'; // for deno: see above
import { Redis } from '@upstash/redis'; // see below for cloudflare and fastly adapters

import { weatherSchema } from '~/utils/zodSchemas';

// Create a new ratelimiter, that allows 3 requests per 1 minute.
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
    /**
     * Optional prefix for the keys used in redis. This is useful if you want to share a redis
     * instance with other applications and want to avoid key collisions. The default prefix is
     * "@upstash/ratelimit"
     */
    prefix: '@upstash/ratelimit'
});

export const shiftControllerRouter = createTRPCRouter({
    getShiftsByDutynumber: publicProcedure
        .input(z.string().regex(completeShiftNameRegex).array())
        .query(async ({ ctx, input }) => {
            const foundDuty = await ctx.prisma.duty.findMany({
                where: { dutyNumber: { in: input } }
            });
            return foundDuty;
        }),

    getAllShifts: publicProcedure.query(async ({ ctx }) => {
        const { success } = await ratelimit.limit(ctx.auth?.userId ?? '');
        if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });

        return ctx.prisma.duty.findMany({
            orderBy: {
                dutyNumber: 'asc'
            }
        });
    }),

    getDayWeather: publicProcedure.query(async () => {
        const hkoUri =
            'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=tc';

        const weatherResult = await getResponseWithType(hkoUri, weatherSchema);
        return weatherResult;
    })
});
