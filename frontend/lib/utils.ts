import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from 'date-fns'; // Make sure to import this at the top of your file


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dateToMicroseconds = (date: Date): number => {
  return date.getTime() * 1000;
};

export const formatTimeForInput = (date: Date) => {
  return format(date, "HH:mm");
};