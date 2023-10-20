import { TRPCError } from "@trpc/server";

import { ZodError, z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import {
  abbreviatedDutyNumber,
  dutyInputRegExValidator,
  prefixRegex,
  sevenShiftRegex,
} from "~/utils/regex";

const prefixSchema = z.string().regex(prefixRegex).array();
type PrefixSchema = z.infer<typeof prefixSchema>;
const dutyNumberSchema = z.string().regex(sevenShiftRegex);
type DutyNumber = z.infer<typeof dutyNumberSchema>;

export const shiftControllerRouter = createTRPCRouter({
  getShiftGivenDutyNumber: publicProcedure
    .input(
      z.object({
        duty: z.string().regex(dutyInputRegExValidator, "invalid duty input"),
      })
    )

    .query(({ input, ctx }) => {
      const resultShift = ctx.prisma.shifts.findMany({
        where: { dutyNumber: { endsWith: input.duty } },
      });

      return resultShift;
    }),

  getWeekShift: publicProcedure
    .input(
      z.object({
        shiftArray: z.string().regex(sevenShiftRegex).array().length(7),
      })
    )
    .query(({ input, ctx }) => {
      const resultShiftArray = ctx.prisma.shifts.findMany({
        where: { dutyNumber: { in: input.shiftArray } },
      });

      return resultShiftArray;
    }),

  getWeekShiftWithPrefix: publicProcedure
    .input(
      z.object({
        shiftArray: z.string().regex(sevenShiftRegex).array().length(7),
      })
    )
    .query(async ({ input, ctx }) => {
      const prefix = await ctx.prisma.weekPrefix.findMany({
        orderBy: { updatedAt: "desc" },
        take: 1,
      });

      const [latestPrefix] = prefix.map(({ prefixes }) =>
        prefixes.map((prefix) => prefix)
      );

      if (!latestPrefix)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "latest prefix not found",
        });

      const combinedDutyName = new Array<string>(7);

      for (let i = 0; i < combinedDutyName.length; i++) {
        const correspondingPrefix = latestPrefix[i] as string;
        const correspondingShift = input.shiftArray[i] as string;
        const isShiftName = correspondingShift.match(abbreviatedDutyNumber);

        combinedDutyName[i] = isShiftName
          ? correspondingPrefix.concat(correspondingShift)
          : correspondingShift;
      }

      const resultShiftArray = await ctx.prisma.shifts.findMany({
        where: { dutyNumber: { in: combinedDutyName } },
      });

      console.log(resultShiftArray);

      return resultShiftArray;
    }),
});
