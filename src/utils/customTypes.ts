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
