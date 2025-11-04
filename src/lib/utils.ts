import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalized = (word: string) => word.toLowerCase().charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase();
