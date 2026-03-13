// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInDays, format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), 'MMM dd, yyyy')
}

export function formatDateShort(date: Date | string): string {
  return format(new Date(date), 'MMM dd')
}

export function calculateNights(checkIn: Date | string, checkOut: Date | string): number {
  return differenceInDays(new Date(checkOut), new Date(checkIn))
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'CONFIRMED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'PENDING':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'CANCELLED':
      return 'bg-red-50 text-red-700 border-red-200'
    case 'COMPLETED':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'PAID':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'UNPAID':
      return 'bg-slate-50 text-slate-700 border-slate-200'
    case 'REFUNDED':
      return 'bg-purple-50 text-purple-700 border-purple-200'
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200'
  }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function calculateOccupancy(bookings: number, totalRooms: number): number {
  if (totalRooms === 0) return 0
  return Math.round((bookings / totalRooms) * 100)
}
