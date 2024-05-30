import type { z } from 'zod';
import type {
    staffIdSchema,
    dayDetailSchema,
    rawShiftArraySchema,
    userPrivateMetadataSchema,
    rostaSchema,
    weatherSchema,
    dutyQueryArraySchema,
    queryStringSchema
} from './zodSchemas';
import type { getFitTimetable } from './helper';
import { bestExchangeFormSchema } from '~/components/Exchange/BestExchangeForm';

export const WorkLocation = [
    'HUH',
    'SHT',
    'SHS',
    'HTD',
    'LOW',
    'TAW',
    'TWD'
] as const;

export const DayOff = [
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

export type QueryArray = z.infer<typeof queryStringSchema>;
export type Weather = WeatherForecast['weatherForecast'][0];
export type BestExchangeFormSchema = z.infer<typeof bestExchangeFormSchema>;
