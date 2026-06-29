import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFallbackLogoUrl(logoUrl: string | null): string | null {
  if (!logoUrl) return null;
  if (logoUrl.includes('logo.clearbit.com')) {
    const domain = logoUrl.replace('https://logo.clearbit.com/', '');
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }
  return logoUrl;
}
