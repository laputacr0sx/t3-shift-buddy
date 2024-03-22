import { type Timetable } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import moment from 'moment';
import { z } from 'zod';

import { clerkMetaProcedure, createTRPCRouter } from '~/server/api/trpc';
import {
    type DateDetailsWithSequences,
    type WeatherForecast
} from '~/utils/customTypes';
import {
    combineDateWithSequence,
    getDateDetailFromId,
    getFitTimetable,
    getResponseWithType,
    defaultRosterDetail,
    translateRow
} from '~/utils/helper';
import { weatherSchema } from '~/utils/zodSchemas';

export const weekDetailsRouter = createTRPCRouter({
    getDetails: clerkMetaProcedure
        .input(z.object({ weekDifference: z.number() }))
        .query(
            async ({
                input: { weekDifference },
                ctx: {
                    prisma,
                    clerkMeta: { row, staffId, updatedAt }
                }
            }) => {
                const correspondingMoment = moment().add(weekDifference, 'w');
                const dateDetails = getDateDetailFromId(
                    correspondingMoment.format(`[Y]Y[W]w`)
                );

                const timetables = await prisma.timetable
                    .findMany({
                        orderBy: { dateOfEffective: 'desc' }
                    })
                    .catch(() => {
                        throw new TRPCError({
                            code: 'BAD_REQUEST',
                            message: '找到不時間表'
                        });
                    });

                const datePrefix = getFitTimetable(timetables, dateDetails);

                const { sequenceId, sequence } = defaultRosterDetail(
                    row,
                    updatedAt,
                    correspondingMoment
                );

                const stringifySequenceId = (sequenceId: string): string => {
                    // Y2024W11A101
                    const year = sequenceId.slice(1, 5);
                    const week = sequenceId.slice(6, 8);
                    const category = sequenceId.slice(8, 9);
                    const row = sequenceId.slice(9);

                    const chineseCategory = translateRow(category).tc;
                    const out = `${year}年${week}期${chineseCategory}更${row}行序`;
                    return out;
                };

                const articulatedTitle = stringifySequenceId(sequenceId);
                let dutyNumbers: { dutyNumbers: string[] };

                try {
                    dutyNumbers = await prisma.sequence.findUniqueOrThrow({
                        select: { dutyNumbers: true },
                        where: {
                            id: sequenceId,
                            staffId: staffId
                        }
                    });
                } catch (error) {
                    dutyNumbers = {
                        dutyNumbers: sequence
                    };
                }

                const combinedDetails = combineDateWithSequence(
                    datePrefix,
                    sequence,
                    dutyNumbers.dutyNumbers
                );

                const forecastURL =
                    'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=tc';

                const { weatherForecast } = await getResponseWithType(
                    forecastURL,
                    weatherSchema
                );

                type Weather = WeatherForecast['weatherForecast'][0];

                const detailsWithWeather = combinedDetails.reduce<
                    (DateDetailsWithSequences & {
                        timetable: Timetable;
                        weather: Weather | null;
                    })[]
                >((weatherDate, date) => {
                    const weather: Weather | undefined = weatherForecast.filter(
                        (dayWeather) =>
                            moment(date.date, 'YYYYMMDD ddd').format(
                                'YYYYMMDD'
                            ) === dayWeather.forecastDate
                    )[0];

                    if (!weather)
                        return [...weatherDate, { ...date, weather: null }];
                    return [...weatherDate, { ...date, weather }];
                }, []);

                return { detailsWithWeather, articulatedTitle, sequenceId };
            }
        )
});
