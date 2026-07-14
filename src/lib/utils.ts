import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function formatReviewDate(dateString: string) {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = MONTH_NAMES[date.getMonth()]
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day} ${month} ${year}, ${hours}:${minutes}`
}

export function formatLongDate(dateString: string) {
  const date = new Date(dateString)
  const day = date.getUTCDate()
  const month = MONTH_NAMES[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  return `${day} ${month} ${year}`
}

export function formatShortDate(dateString: string) {
  const date = new Date(dateString)
  const day = date.getUTCDate()
  const month = MONTH_NAMES[date.getUTCMonth()].slice(0, 3)
  const year = date.getUTCFullYear()
  return `${day} ${month} ${year}`
}

export function formatShortDateTime(dateString: string) {
  const date = new Date(dateString)
  const day = date.getUTCDate()
  const month = MONTH_NAMES[date.getUTCMonth()].slice(0, 3)
  const year = date.getUTCFullYear()
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  return `${day} ${month} ${year}, ${hours}:${minutes}`
}
