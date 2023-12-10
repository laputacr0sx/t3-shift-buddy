import { prisma } from "../src/server/db";

import { timetables } from "./seeds/timetables";
import { duties } from "./seeds/duties";
import { users } from "./seeds/users";
import { staff } from "./seeds/staff";
import { roster } from "./seeds/roster";
import { sequences } from "./seeds/sequences";

async function main() {
  await prisma.user.createMany({ data: users });
  console.log("users seeded!");

  await prisma.staff.createMany({ data: staff });
  console.log("staff seeded!");

  await prisma.timetable.createMany({ data: timetables });
  console.log("timetables seeded!");

  await prisma.duty.createMany({ data: duties });
  console.log("duties seeded!");

  await prisma.roster.create({
    data: {
      id: "Y2023W51",
      publishedAt: new Date("2023-12-14T00:00:00.0000Z"),
      publisherId: "602949",
      Sequence: {
        create: [
          {
            id: "Y2023W50A83",
            staffId: "602949",
            createdAt: new Date(),
            updatedAt: new Date(),
            dutyNumbers: [
              "RD",
              "J15133",
              "J15140",
              "D14135",
              "J15134",
              "F75602",
              "Y71107",
            ],
          },
        ],
      },
    },
  });
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
