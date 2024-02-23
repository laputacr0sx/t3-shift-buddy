import { type Timetable } from '@prisma/client';

export const timetables: Timetable[] = [
    {
        toc: 'Training',
        prefix: '',
        dateOfEffective: new Date('1900-01-01T00:00:00.0000Z'),
        isSpecial: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        toc: 'Special',
        prefix: '',
        dateOfEffective: new Date('1900-01-01T00:00:00.0000Z'),
        isSpecial: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
