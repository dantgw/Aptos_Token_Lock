import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from 'date-fns'; // Make sure to import these


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dateToMicroseconds = (date: Date): number => {
  return date.getTime() * 1000
};

export const formatTimeForInput = (date: Date) => {
  return format(date, "HH:mm");
};

export const monthsToMicroseconds = (months: number) => {
  return Math.floor(months * 30 * 24 * 60 * 60 * 1000000);
};

export const daysToMicroseconds = (days: number) => {
  return Math.floor(days * 24 * 60 * 60 * 1000000);
};