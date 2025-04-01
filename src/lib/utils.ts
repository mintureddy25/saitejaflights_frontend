import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getTimeFromDateTime(datetimeString: string): string {
  // Create a new Date object from the string
  let date = new Date(datetimeString);

  // Extract the hours and minutes
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Format them as "HH:mm"
  return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}

export const getFormattedDate = (datetimeString: string): string => {
  let date = new Date(datetimeString);

  // Get the day, month, and year
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' }); // Full month name
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function calculateDuration(startDatetime: string, endDatetime: string): string {
  // Parse the datetime strings into Date objects
  const start: Date = new Date(startDatetime);
  const end: Date = new Date(endDatetime);
  
  // Calculate the difference in milliseconds
  const diffInMilliseconds: number = end.getTime() - start.getTime();
  
  // Convert milliseconds to total minutes
  const totalMinutes: number = Math.floor(diffInMilliseconds / 60000);
  
  // Calculate hours and minutes
  const hours: number = Math.floor(totalMinutes / 60);
  const minutes: number = totalMinutes % 60;
  
  // Format hours and minutes as hh:mm
  const formattedTime: string = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  return formattedTime;
}
