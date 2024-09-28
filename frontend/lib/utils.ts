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

export const microsecondsToLocalTime = (timestamp: number) => {
  const date = new Date(timestamp / 1000); // Convert seconds to milliseconds
  return date.toLocaleString(); // This will use the user's locale settings
};

export const microsecondsPeriodToString = (timestamp: number) => {
  const date = new Date(timestamp / 1000); // Convert seconds to milliseconds
  return date.toLocaleString(); // This will use the user's locale settings
};

export function microsecondsToTimeString(microseconds: number): string {
  const seconds = microseconds / 1_000_000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;
  const months = days / 30.44; // Average month length
  const years = days / 365.25; // Account for leap years

  if (years >= 1) return `${Math.round(years)} year${years >= 2 ? 's' : ''}`;
  if (months >= 1) return `${Math.round(months)} month${months >= 2 ? 's' : ''}`;
  if (weeks >= 1) return `${Math.round(weeks)} week${weeks >= 2 ? 's' : ''}`;
  if (days >= 1) return `${Math.round(days)} day${days >= 2 ? 's' : ''}`;
  if (hours >= 1) return `${Math.round(hours)} hour${hours >= 2 ? 's' : ''}`;
  if (minutes >= 1) return `${Math.round(minutes)} minute${minutes >= 2 ? 's' : ''}`;
  return `${Math.round(seconds)} second${seconds >= 2 ? 's' : ''}`;
}