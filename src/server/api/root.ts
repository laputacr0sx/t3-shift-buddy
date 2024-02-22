import { createTRPCRouter } from '~/server/api/trpc';
// import { shiftControllerRouter } from './routers/shiftController';
// import { prefixControllerRouter } from './routers/prefixController';
import { databaseControllerRouter } from './routers/databaseController';

import { calendarControllerRouter } from './routers/calendarController';
import { timetableControllerRouter } from './routers/timetableController';
import { rosterControllerRouter } from './routers/rosterController';
import { sequenceControllerRouter } from './routers/sequenceController';
import { userControllerRouter } from './routers/userController';
import { dutyControllerRouter } from './routers/dutyController';
import { weekDetailsRouter } from './routers/weekDetailsController';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    databaseController: databaseControllerRouter,
    dutyController: dutyControllerRouter,
    // shiftController: shiftControllerRouter,
    // prefixController: prefixControllerRouter,
    timetableController: timetableControllerRouter,
    calendarController: calendarControllerRouter,
    rosterController: rosterControllerRouter,
    sequenceController: sequenceControllerRouter,
    userController: userControllerRouter,
    weekDetailsController: weekDetailsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
