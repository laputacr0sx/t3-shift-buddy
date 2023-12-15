import { createTRPCRouter } from "~/server/api/trpc";
import { shiftControllerRouter } from "./routers/shiftController";
import { prefixControllerRouter } from "./routers/prefixController";
import { databaseControllerRouter } from "./routers/databaseController";
import { userControllerRouter } from "./routers/userController";
import { calendarControllerRouter } from "./routers/calendarController";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  databaseController: databaseControllerRouter,
  shiftController: shiftControllerRouter,
  prefixController: prefixControllerRouter,
  userController: userControllerRouter,
  calendarController: calendarControllerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
