import { createTRPCRouter } from "~/server/api/trpc";
import { shiftControllerRouter } from "./routers/shiftController";
import { prefixControllerRouter } from "./routers/prefixController";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  shiftController: shiftControllerRouter,
  prefixController: prefixControllerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
