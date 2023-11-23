import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { DayDetail, weatherSchema } from "~/utils/customTypes";
import { fetchTyped, getJointDutyNumber } from "~/utils/helper";

import {
  abbreviatedDutyNumber,
  dayOffRegex,
  dutyInputRegExValidator,
  inputShiftCodeRegex,
  proShiftNameRegex,
  shiftNameRegex,
} from "~/utils/regex";

export const shiftControllerRouter = createTRPCRouter({
  getAllShifts: publicProcedure.query(({ ctx }) =>
    ctx.prisma.shift.findMany({
      where: { dutyNumber: { contains: "" } },
      orderBy: {
        dutyNumber: "asc",
      },
    })
  ),

  getAllShiftsWithInfinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 20;
      const { cursor } = input;

      const items = await ctx.prisma.shift.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          dutyNumber: "asc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
    }),

  getShiftGivenDutyNumber: publicProcedure
    .input(
      z.object({
        duty: z.string().regex(dutyInputRegExValidator, "invalid duty input"),
      })
    )

    .query(({ input, ctx }) => {
      const resultShift = ctx.prisma.shift.findMany({
        where: { dutyNumber: { endsWith: input.duty } },
      });

      return resultShift;
    }),

  getWeekShift: publicProcedure
    .input(
      z.object({
        shiftArray: z.string().regex(shiftNameRegex).array().length(7),
      })
    )
    .query(({ input, ctx }) => {
      const resultShiftArray = ctx.prisma.shift.findMany({
        where: { dutyNumber: { in: input.shiftArray } },
      });

      return resultShiftArray;
    }),

  getShiftDetailWithoutAlphabeticPrefix: publicProcedure
    .input(
      z
        .object({
          date: z.string().regex(/\d{8}/gim),
          shiftCode: z.string().regex(proShiftNameRegex),
        })
        .array()
    )
    .query(async ({ ctx, input }) => {
      const prefixChronological = await ctx.prisma.weekPrefix
        .findMany({
          orderBy: { weekNumber: "desc" },
          take: 1,
        })
        .then((weekPrefix) =>
          weekPrefix.flatMap(({ prefixes }) =>
            prefixes.flatMap((prefix) => prefix)
          )
        )
        .catch(() => {
          throw new TRPCError({ code: "BAD_REQUEST" });
        });

      const distinctPrefix = Array.from(new Set(prefixChronological));

      const shiftCodeOnly = input.map((day) => day.shiftCode);

      const jointDutyNumber = getJointDutyNumber(distinctPrefix, shiftCodeOnly);

      const resultDuties = await ctx.prisma.shift.findMany({
        where: { dutyNumber: { in: jointDutyNumber } },
      });

      const reduceResult = input.reduce<DayDetail[]>((accumulatedDays, day) => {
        if (day.shiftCode.match(dayOffRegex)) {
          accumulatedDays.push({
            date: day.date,
            title: day.shiftCode,
            dutyNumber: day.shiftCode,
          } as DayDetail);
        }

        const temp = resultDuties.filter(
          (duty) => duty.dutyNumber.slice(1) === day.shiftCode
        )[0];

        if (temp)
          accumulatedDays.push({
            ...temp,
            date: day.date,
            title: temp.dutyNumber,
          } as DayDetail);

        return accumulatedDays;
      }, []);

      console.log(reduceResult);

      return reduceResult;
    }),

  getDayWeather: publicProcedure.query(async () => {
    const hkoUri =
      "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=tc";

    const weatherResult = await fetchTyped(hkoUri, weatherSchema);
    return weatherResult;
  }),

  getWeekShiftWithPrefix: publicProcedure
    .input(
      z.object({
        // shiftArray: z.string().regex(shiftNameRegex).array().min(1),
        shiftArray: z.string().regex(inputShiftCodeRegex).array().min(1),
      })
    )
    .query(async ({ input, ctx }) => {
      const prefix = await ctx.prisma.weekPrefix.findMany({
        orderBy: { weekNumber: "desc" },
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

      console.log(input, latestPrefix);

      const combinedDutyName = new Array<string>(7);

      for (let i = 0; i < combinedDutyName.length; i++) {
        const correspondingPrefix = latestPrefix[i] as string;
        const correspondingShift = input.shiftArray[i] as string;

        const isShiftName = correspondingShift.match(abbreviatedDutyNumber);

        combinedDutyName[i] = isShiftName
          ? correspondingPrefix.concat(correspondingShift)
          : correspondingShift;
      }

      const resultShiftArray = await ctx.prisma.shift.findMany({
        where: { dutyNumber: { in: combinedDutyName } },
      });

      return { combinedDutyName, resultShiftArray };
    }),
});
