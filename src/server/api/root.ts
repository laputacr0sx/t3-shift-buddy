import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { getShiftRouter } from "./routers/getShifts";
import { updateShiftRouter } from "./routers/updateShifts";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  getShifts: getShiftRouter,
  updateShifts: updateShiftRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
