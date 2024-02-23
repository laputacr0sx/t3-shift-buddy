import { TRPCError } from '@trpc/server';
import moment from 'moment';
import { z } from 'zod';

import { clerkMetaProcedure, createTRPCRouter } from '~/server/api/trpc';
import {
    combineDateWithSequence,
    getDateDetailFromId,
    getFitTimetable,
    getRosterRow,
    getRota,
    stringifyCategory
} from '~/utils/helper';

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

                return { combinedDetails, articulatedTitle };
            }
        )
});
