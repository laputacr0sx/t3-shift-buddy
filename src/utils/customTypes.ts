import { type Shift } from "@prisma/client";
import { z } from "zod";
import { dutyInputRegExValidator, sevenShiftRegex } from "./regex";

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

export const rawShiftArraySchema = z.array(z.string().regex(sevenShiftRegex));

export type RawShiftArray = {
  legitRawShiftArray: z.infer<typeof rawShiftArraySchema>;
};

// {
//   "dtstart": [
//     "20220101",
//     {
//       "value": "DATE"
//     }
//   ],
//   "dtend": [
//     "20220102",
//     {
//       "value": "DATE"
//     }
//   ],
//   "transp": "TRANSPARENT",
//   "uid": "20220101@1823.gov.hk",
//   "summary": "一月一日"
// },

export const holidaysObjectSchema = z.object({
  vcalendar: z.array(
    z.object({
      prodid: z.string(),
      version: z.string(),
      calscale: z.string(),
      x_wr_timezone: z.string(),
      x_wr_calname: z.string(),
      x_wr_caldesc: z.string(),
      vevent: z.array(
        z.object({
          dtstart: z.array(
            z.string().datetime(),
            z.object({ value: z.string() })
          ),
          dtend: z.array(
            z.string().datetime(),
            z.object({ value: z.string() })
          ),
          uid: z.string(),
          summary: z.string(),
          transp: z.string(),
        })
      ),
    })
  ),
});

export type HolidaysObject = z.infer<typeof holidaysObjectSchema>;
