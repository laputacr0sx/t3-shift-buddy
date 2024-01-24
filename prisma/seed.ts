import { prisma } from '../src/server/db';

import { timetables } from './seeds/timetables';
import { duties } from './seeds/duties';
import { users } from './seeds/users';
import { staff } from './seeds/staff';
import { V71 } from './seeds/timetables/V71';

import { J15 } from './seeds/timetables/J15';
import { D14 } from './seeds/timetables/D14';
import { C75 } from './seeds/timetables/C75';
import { others } from './seeds/timetables/others';
import { rosters } from './seeds/roster';
import { R15 } from './seeds/timetables/R15';

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
    await prisma.duty.createMany({ data: R15 });
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
