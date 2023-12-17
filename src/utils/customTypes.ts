import { type z } from "zod";
import {
  dayDetailSchema,
  type rawShiftArraySchema,
  type userPrivateMetadataSchema,
} from "./zodSchemas";

export const workLocation = [
  "HUH",
  "SHT",
  "SHS",
  "HTD",
  "LOW",
  "TAW",
  "TWD",
] as const;

export const dayOff = [
  "RD",
  "CL",
  "AL",
  "GH",
  "SH",
  "WB_L",
  "MA_L",
  "ALS",
] as const;

export type DayDetail = z.infer<typeof dayDetailSchema>;

export type RawShiftArray = {
  legitRawShiftArray: z.infer<typeof rawShiftArraySchema>;
};
export { dayDetailSchema };

export type UserPrivateMetadata = z.infer<typeof userPrivateMetadataSchema>;
