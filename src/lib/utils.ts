import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { threeDigitShiftRegex } from "./regex";

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

export function convertDuration(rawDuration: string): string {
  const [wHour, wMinute] = rawDuration.split(":");
  if (!wMinute || !wHour) return "0";
  const minuteDecimal = parseInt(wMinute) / 60;
  return `${parseInt(wHour) + minuteDecimal}`;
}

interface shiftObject {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export function extendShiftsArrayToObject(shifts: string[]) {
  const weekDate = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  return weekDate.reduce((pre, curr, i) => ({ ...pre, [curr]: shifts[i] }), {});
}
