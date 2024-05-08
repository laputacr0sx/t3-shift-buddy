import type { z } from 'zod';
import type {
    staffIdSchema,
    dayDetailSchema,
    rawShiftArraySchema,
    userPrivateMetadataSchema,
    rostaSchema,
    weatherSchema,
    dutyQueryArraySchema
} from './zodSchemas';
import type { getFitTimetable } from './helper';

export const workLocation = [
    'HUH',
    'SHT',
    'SHS',
    'HTD',
    'LOW',
    'TAW',
    'TWD'
] as const;

export const dayOff = [
    'RD',
    'CL',
    'AL',
    'GH',
    'SH',
    'WB_L',
    'MA_L',
    'ALS'
] as const;

export type DateDetails = ReturnType<typeof getFitTimetable>;
export type DateDetailsWithSequences = DateDetails[0] & {
    standardDuty: string;
    actualDuty: string;
};

export type DayDetail = z.infer<typeof dayDetailSchema>;

export type WeatherForecast = z.infer<typeof weatherSchema>;

export type RawShiftArray = {
    legitRawShiftArray: z.infer<typeof rawShiftArraySchema>;
};

export type CustomUserPrivateMetadata = z.infer<
    typeof userPrivateMetadataSchema
>;

export type StaffId = z.infer<typeof staffIdSchema>;

export type DutyQueryArray = z.infer<typeof dutyQueryArraySchema>;

export type Rosta = z.infer<typeof rostaSchema>;

export type Weather = WeatherForecast['weatherForecast'][0];
