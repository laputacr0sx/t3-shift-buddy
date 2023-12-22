import { type Sequence } from "@prisma/client";

export const sequences: Partial<Sequence>[] = [
  {
    id: "A1",
    createdAt: new Date(),
    updatedAt: new Date(),
    dutyNumbers: [""],
  },
];
