import { type Timetable } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import moment from 'moment';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import type { Weather } from '~/utils/customTypes';
import {
    type DateDetail,
    getDateDetailFromId,
    getFitTimetable,
    getResponseWithType
} from '~/utils/helper';
import { weatherSchema } from '~/utils/zodSchemas';

export const timetableControllerRouter = createTRPCRouter({
    getAllTimetables: publicProcedure.query(async ({ ctx }) => {
        const timetables = await ctx.prisma.timetable
            .findMany({
                orderBy: { dateOfEffective: 'desc' }
            })
            .catch(() => {
                throw new TRPCError({ code: 'BAD_REQUEST' });
            });

        return timetables;
    }),

    getAvailableTimetables: publicProcedure.query(async ({ ctx }) => {
        const timetables = await ctx.prisma.timetable.findMany({ where: {} });
        return timetables;
    }),

    getSuitableTimetables: publicProcedure.query(
        async ({ ctx: { prisma } }) => {
            const correspondingMoment = moment();
            const dateDetails = getDateDetailFromId(
                correspondingMoment.format(`[Y]Y[W]w`),
                true
            );

            const timetables = await prisma.timetable
                .findMany({
                    orderBy: { dateOfEffective: 'desc' }
                })
                .catch(() => {
                    throw new TRPCError({ code: 'BAD_REQUEST' });
                });

            const datePrefix = getFitTimetable(timetables, dateDetails);

            const hkoUri =
                'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=tc';

            const { weatherForecast } = await getResponseWithType(
                hkoUri,
                weatherSchema
            );

            const dayDeatilsWithWeather = datePrefix.reduce<
                (DateDetail & {
                    timetable: Timetable;
                    weather: Weather | null;
                })[]
            >((weatherDate, detail) => {
                const weather: Weather | undefined = weatherForecast.filter(
                    (dayWeather) =>
                        moment(detail.date, 'YYYYMMDD ddd').format(
                            'YYYYMMDD'
                        ) === dayWeather.forecastDate
                )[0];

                if (!weather)
                    return [...weatherDate, { ...detail, weather: null }];
                return [...weatherDate, { ...detail, weather }];
            }, []);

            return dayDeatilsWithWeather;
        }
    )
});
