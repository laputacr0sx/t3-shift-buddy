import { Timetable } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import moment from 'moment';
import { z } from 'zod';

import { clerkMetaProcedure, createTRPCRouter } from '~/server/api/trpc';
import { DateDetailsWithSequences, WeatherForecast } from '~/utils/customTypes';
import {
    DateDetail,
    combineDateWithSequence,
    getDateDetailFromId,
    getFitTimetable,
    getResponseWithType,
    getRosterRow,
    getRota,
    stringifyCategory
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
                    clerkMeta: { row, staffId }
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
                        throw new TRPCError({ code: 'BAD_REQUEST' });
                    });

                const datePrefix = getFitTimetable(timetables, dateDetails);

                const { tc, en } = stringifyCategory(row);
                const rotaCat = getRota(en);

                const sequenceIdInQuery = `${correspondingMoment.format(
                    '[Y]YYYY[W]WW'
                )}${row}`;

                const { sequence, rowInQuery } = getRosterRow(
                    rotaCat,
                    row,
                    weekDifference
                );

                let dutyNumbers: { dutyNumbers: string[] };
                try {
                    dutyNumbers = await prisma.sequence.findUniqueOrThrow({
                        select: { dutyNumbers: true },
                        where: {
                            id: sequenceIdInQuery,
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

                const articulatedTitle = `${correspondingMoment.format(
                    `Y年WW期`
                )}${tc}更行序${rowInQuery + 1}`;

                const hkoUri =
                    'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=tc';

                const { weatherForecast } = await getResponseWithType(
                    hkoUri,
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

                // console.log(testWeather);

                return { detailsWithWeather, articulatedTitle };
            }
        )
});
