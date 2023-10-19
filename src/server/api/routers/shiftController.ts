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
      const resultShiftArray = await ctx.prisma.shifts.findMany({
        where: { dutyNumber: { in: input.shiftArray } },
      });

      const prefix = await ctx.prisma.weekPrefix.findMany({
        orderBy: { updatedAt: "desc" },
        take: 1,
      });

      if (!prefix || !resultShiftArray)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "result not found",
        });

      const dutyNumberArray = resultShiftArray.map(
        ({ dutyNumber }) => dutyNumber
      );

      const [latestPrefix] = prefix.map(({ prefixes }) =>
        prefixes.map((prefix) => prefix)
      );

      if (!dutyNumberArray || !prefix)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "failed parsing data",
        });

      const validatedLatestPrefix = prefixSchema.safeParse(latestPrefix);

      if (!validatedLatestPrefix.success) throw validatedLatestPrefix.error;

      let combinedDutyName = new Array<string>(7);

      for (let i = 0; i < combinedDutyName.length; i++) {
        const currentPrefix = validatedLatestPrefix.data[i] as string;
        const dutyNumber = dutyNumberArray[i] as string;
        console.log(currentPrefix, dutyNumber);

        combinedDutyName = [
          ...dutyNumberArray,
          abbreviatedDutyNumber.test(dutyNumber)
            ? currentPrefix.concat(dutyNumber)
            : dutyNumber,
        ];
      }

      // const compleShiftNameArray = .map(
      //   (prefix, i) => {
      //     return !threeDigitShiftRegex.test(completeShift[i] as string)
      //       ? (completeShift[i] as string)
      //       : prefix.concat(completeShift[i] as string);
      //   }
      // );

      return combinedDutyName;
    }),
});
