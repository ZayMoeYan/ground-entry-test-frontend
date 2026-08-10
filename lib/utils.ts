import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageUrl = (imagePath?: string | null) => {
  if (!imagePath) return '#';

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const cleanBackendUrl = backendUrl.replace(/\/$/, '');
  const cleanPath = imagePath.replace(/^\//, '');

  return `${cleanBackendUrl}/${cleanPath}`;
};