import { createTRPCRouter } from "~/server/api/trpc";
import { getShiftRouter } from "./routers/getShifts";
import { prefixControllerRouter } from "./routers/prefixController";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  getShifts: getShiftRouter,
  prefixController: prefixControllerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
