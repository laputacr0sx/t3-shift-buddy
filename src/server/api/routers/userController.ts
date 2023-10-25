import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prefixRegex } from "~/utils/regex";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userControllerRouter = createTRPCRouter({});
