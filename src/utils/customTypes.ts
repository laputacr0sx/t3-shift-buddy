import { type Shift } from "@prisma/client";
import { z } from "zod";
import { dutyInputRegExValidator, shiftNameRegex } from "./regex";

export const workLocation = [
  "HUH",
  "SHT",
  "SHS",
  "HTD",
  "LOW",
  "TAW",
  "TWD",
] as const;
export interface WeekComplex {
  date: Date;
  title: string;
  dutyObject: Shift;
}

export const dayDetailSchema = z.object({
  date: z.string().datetime(),
  title: z.string(),
  id: z.string().uuid(),
  dutyNumber: z.string().regex(dutyInputRegExValidator),
  bNL: z.enum(workLocation),
  bNT: z.string(),
  bFT: z.string(),
  bFL: z.enum(workLocation),
  duration: z.string(),
  remarks: z.string(),
});

export type DayDetail = z.infer<typeof dayDetailSchema>;

export const shiftSequenceSchema = z.string();

export const rawShiftArraySchema = z.array(z.string().regex(shiftNameRegex));

export type RawShiftArray = {
  legitRawShiftArray: z.infer<typeof rawShiftArraySchema>;
};

export const minorForcastSchema = z.object({
  value: z.number(),
  unit: z.enum(["C", "percent"]),
});

export const weatherSchema = z.object({
  generalSituation: z.string(),
  updateTime: z.string(),
  weatherForecast: z
    .object({
      forecastDate: z.string(),
      week: z.enum([
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日",
      ]),
      forecastWind: z.string(),
      forecastWeather: z.string(),
      forecastMaxtemp: minorForcastSchema,
      forecastMintemp: minorForcastSchema,
      forecastMaxrh: minorForcastSchema,
      forecastMinrh: minorForcastSchema,
      ForecastIcon: z.number(),
      PSR: z.enum(["高", "中高", "中", "中低", "低"]),
    })
    .array(),
  soilTemp: z
    .object({
      place: z.string(),
      value: z.number(),
      unit: z.enum(["C", "F"]),
      recordTime: z.string(),
      depth: z.object({
        unit: z.string(),
        value: z.number(),
      }),
    })
    .array(),
});
