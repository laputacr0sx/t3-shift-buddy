import { prisma } from "~/server/db";
import { randomUUID } from "crypto";

import { duties } from "./seeds/duties";
import { timetables } from "./seeds/timetables";

async function main() {
  await prisma.user.create({
    data: { loginId: "ngsh602949", password: "testingpwd" },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
