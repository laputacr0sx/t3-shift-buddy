import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prefixRegex } from "~/utils/regex";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userControllerRouter = createTRPCRouter({
  // createMetaData: protectedProcedure.input().mutation(),
});
