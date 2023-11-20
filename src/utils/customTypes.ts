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

export const HKO_RESPONSE = {
  generalSituation:
    "東北季候風會在未來數日稍為緩和，華南沿岸地區氣溫逐漸回升，天氣持續晴朗及乾燥，日夜溫差頗大。預料另一股東北季候風會在本週後期影響廣東沿岸，該區風勢頗大。",
  weatherForecast: [
    {
      forecastDate: "20231119",
      week: "星期日",
      forecastWind: "東至東北風3至4級。",
      forecastWeather: "大致天晴及乾燥。早上清涼。",
      forecastMaxtemp: {
        value: 24,
        unit: "C",
      },
      forecastMintemp: {
        value: 17,
        unit: "C",
      },
      forecastMaxrh: {
        value: 65,
        unit: "percent",
      },
      forecastMinrh: {
        value: 40,
        unit: "percent",
      },
      ForecastIcon: 50,
      PSR: "低",
    },
    {
      forecastDate: "20231120",
      week: "星期一",
      forecastWind: "東至東北風3至4級。",
      forecastWeather: "天晴乾燥。",
      forecastMaxtemp: {
        value: 25,
        unit: "C",
      },
      forecastMintemp: {
        value: 19,
        unit: "C",
      },
      forecastMaxrh: {
        value: 70,
        unit: "percent",
      },
      forecastMinrh: {
        value: 45,
        unit: "percent",
      },
      ForecastIcon: 50,
      PSR: "低",
    },
    {
      forecastDate: "20231121",
      week: "星期二",
      forecastWind: "東至東北風3至4級。",
      forecastWeather: "天晴乾燥。",
      forecastMaxtemp: {
        value: 26,
        unit: "C",
      },
      forecastMintemp: {
        value: 20,
        unit: "C",
      },
      forecastMaxrh: {
        value: 75,
        unit: "percent",
      },
      forecastMinrh: {
        value: 45,
        unit: "percent",
      },
      ForecastIcon: 50,
      PSR: "低",
    },
    {
      forecastDate: "20231122",
      week: "星期三",
      forecastWind: "東風3至4級。",
      forecastWeather: "天晴，日間乾燥。",
      forecastMaxtemp: {
        value: 27,
        unit: "C",
      },
      forecastMintemp: {
        value: 21,
        unit: "C",
      },
      forecastMaxrh: {
        value: 80,
        unit: "percent",
      },
      forecastMinrh: {
        value: 50,
        unit: "percent",
      },
      ForecastIcon: 50,
      PSR: "低",
    },
    {
      forecastDate: "20231123",
      week: "星期四",
      forecastWind: "東北風2至3級，稍後北風4級。",
      forecastWeather: "天晴，日間乾燥。",
      forecastMaxtemp: {
        value: 27,
        unit: "C",
      },
      forecastMintemp: {
        value: 21,
        unit: "C",
      },
      forecastMaxrh: {
        value: 80,
        unit: "percent",
      },
      forecastMinrh: {
        value: 50,
        unit: "percent",
      },
      ForecastIcon: 50,
      PSR: "低",
    },
    {
      forecastDate: "20231124",
      week: "星期五",
      forecastWind: "北至東北風4至5級，稍後離岸及高地間中6級。",
      forecastWeather: "大致天晴及乾燥。",
      forecastMaxtemp: {
        value: 25,
        unit: "C",
      },
      forecastMintemp: {
        value: 20,
        unit: "C",
      },
      forecastMaxrh: {
        value: 75,
        unit: "percent",
      },
      forecastMinrh: {
        value: 45,
        unit: "percent",
      },
      ForecastIcon: 50,
      PSR: "低",
    },
    {
      forecastDate: "20231125",
      week: "星期六",
      forecastWind: "東至東北風4至5級，離岸及高地間中6級。",
      forecastWeather: "部分時間有陽光及乾燥。",
      forecastMaxtemp: {
        value: 25,
        unit: "C",
      },
      forecastMintemp: {
        value: 20,
        unit: "C",
      },
      forecastMaxrh: {
        value: 75,
        unit: "percent",
      },
      forecastMinrh: {
        value: 50,
        unit: "percent",
      },
      ForecastIcon: 51,
      PSR: "低",
    },
    {
      forecastDate: "20231126",
      week: "星期日",
      forecastWind: "東北風4至5級。",
      forecastWeather: "部分時間有陽光及乾燥。",
      forecastMaxtemp: {
        value: 25,
        unit: "C",
      },
      forecastMintemp: {
        value: 20,
        unit: "C",
      },
      forecastMaxrh: {
        value: 75,
        unit: "percent",
      },
      forecastMinrh: {
        value: 50,
        unit: "percent",
      },
      ForecastIcon: 51,
      PSR: "低",
    },
    {
      forecastDate: "20231127",
      week: "星期一",
      forecastWind: "東北風4級。",
      forecastWeather: "大致天晴及乾燥。",
      forecastMaxtemp: {
        value: 26,
        unit: "C",
      },
      forecastMintemp: {
        value: 20,
        unit: "C",
      },
      forecastMaxrh: {
        value: 75,
        unit: "percent",
      },
      forecastMinrh: {
        value: 50,
        unit: "percent",
      },
      ForecastIcon: 50,
      PSR: "低",
    },
  ],
  updateTime: "2023-11-19T02:50:00+08:00",
  seaTemp: {
    place: "北角",
    value: 22,
    unit: "C",
    recordTime: "2023-11-18T14:00:00+08:00",
  },
  soilTemp: [
    {
      place: "香港天文台",
      value: 25.2,
      unit: "C",
      recordTime: "2023-11-18T07:00:00+08:00",
      depth: {
        unit: "metre",
        value: 0.5,
      },
    },
    {
      place: "香港天文台",
      value: 27.4,
      unit: "C",
      recordTime: "2023-11-18T07:00:00+08:00",
      depth: {
        unit: "metre",
        value: 1,
      },
    },
  ],
};
