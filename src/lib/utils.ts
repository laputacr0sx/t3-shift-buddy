import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNextWeekDates() {
  const d = new Date();
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7) + 1);

  let weekArr: Date[] = [];
  const startDate = new Date(d);

  for (let i = 0; i < 7; i++) {
    weekArr = [...weekArr, new Date(startDate)];

    startDate.setDate(startDate.getDate() + 1);
  }
  return weekArr;
}
