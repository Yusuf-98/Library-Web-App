import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// --- Classes ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Errors ---
export function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}

// --- Dates ---
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

export function todayLocalISO() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function addDaysISO(isoDate: string, days: number) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10)
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
