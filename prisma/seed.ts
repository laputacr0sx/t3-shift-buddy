import { prisma } from '../src/server/db';
import { D14 } from './seeds/timetables/D14';

import { F75 } from './seeds/timetables/F75';
import { R15 } from './seeds/timetables/R15';
import { V13 } from './seeds/timetables/V13';
import { Z71 } from './seeds/timetables/Z71';

async function main() {
    // await prisma.user.createMany({ data: users });
    // console.log('users seeded!');

    // await prisma.staff.createMany({ data: staff });
    // console.log('staff seeded!');

    // await prisma.timetable.createMany({ data: timetables });
    // console.log('timetables seeded!');

    // await prisma.duty.createMany({
    //     data: [...V71, ...J15, ...C75, ...D14, ...others]
    // });
    // console.log('duties with toc seeded!');

    // await prisma.roster.createMany({
    //     data: rosters
    // });
    await prisma.duty.createMany({
        data: [...V13, ...R15, ...Z71, ...D14, ...F75]
    });

    // await prisma.sequence.upsert({ create: {}, update: {}, where: {} });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
