import type { z } from 'zod';
import type {
    staffIdSchema,
    dayDetailSchema,
    rawShiftArraySchema,
    userPrivateMetadataSchema
} from './zodSchemas';

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

export type DayDetail = z.infer<typeof dayDetailSchema>;

export type RawShiftArray = {
    legitRawShiftArray: z.infer<typeof rawShiftArraySchema>;
};

export type UserPrivateMetadata = z.infer<typeof userPrivateMetadataSchema>;

export type StaffId = z.infer<typeof staffIdSchema>;
