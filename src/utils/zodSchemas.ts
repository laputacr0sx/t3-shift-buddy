import { z } from 'zod';
import {
    dutyInputRegExValidator,
    inputShiftCodeRegex,
    rostaRegex,
    rowSequenceRegex,
    shiftNameRegex
} from './regex';
import { workLocation } from './customTypes';
import moment from 'moment';

export const dayDetailName = `Y${moment().year()}W${moment().week() + 1}`;

export const sevenSlotsSearchFormSchema = z.object({
    [dayDetailName]: z
        .object({
            shiftCode: z
                .string()
                .regex(inputShiftCodeRegex, '錯誤更份號碼')
                .max(7, '最長更號不多於7個字，例991127A / 881101a')
        })
        .array()
        .min(1, 'At least one shift code must be provided')
});

export const usersSchema = z
    .object({
        emailAddress: z.string().array(),
        externalId: z.string(),
        phoneNumber: z.string().array(),
        username: z.string(),
        password: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        publicMetadata: z.record(z.string(), z.unknown()),
        privateMetadata: z.record(z.string(), z.unknown()),
        unsafeMetadata: z.record(z.string(), z.unknown())
    })
    .array();

export const staffIdSchema = z
    .string({ invalid_type_error: '以字串輸入此欄' })
    .length(6, '員工號碼應有6位數字');

export const userPrivateMetadataSchema = z.object({
    staffId: staffIdSchema,
    // row: z.string().regex(rowSequenceRegex, "行序格式為 A1 / B50"),
    row: z.string().regex(rowSequenceRegex)
});

export const shiftSequenceSchema = z.string();

export const rawShiftArraySchema = z.array(z.string().regex(shiftNameRegex));

export const minorForcastSchema = z.object({
    value: z.number(),
    unit: z.enum(['C', 'percent'])
});

export const dayDetailSchema = z.object({
    date: z.string(),
    title: z.string(),
    id: z.string().uuid(),
    dutyNumber: z.string().regex(dutyInputRegExValidator),
    bNL: z.enum(workLocation),
    bNT: z.string(),
    bFT: z.string(),
    bFL: z.enum(workLocation),
    duration: z.string(),
    remarks: z.string(),
    staffId: z.string().nullable()
});

export const weatherSchema = z.object({
    generalSituation: z.string(),
    updateTime: z.string(),
    weatherForecast: z
        .object({
            forecastDate: z.string(),
            week: z.enum([
                '星期一',
                '星期二',
                '星期三',
                '星期四',
                '星期五',
                '星期六',
                '星期日'
            ]),
            forecastWind: z.string(),
            forecastWeather: z.string(),
            forecastMaxtemp: minorForcastSchema,
            forecastMintemp: minorForcastSchema,
            forecastMaxrh: minorForcastSchema,
            forecastMinrh: minorForcastSchema,
            ForecastIcon: z.number(),
            PSR: z.enum(['高', '中高', '中', '中低', '低'])
        })
        .array(),
    soilTemp: z
        .object({
            place: z.string(),
            value: z.number(),
            unit: z.enum(['C', 'F']),
            recordTime: z.string(),
            depth: z.object({
                unit: z.string(),
                value: z.number()
            })
        })
        .array()
});

export const rostaSchema = z.string().regex(rostaRegex).array().length(7);

export const rotaSchema = z.string().regex(rostaRegex);
