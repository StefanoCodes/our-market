import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ZodIssue } from 'zod'
import { ZodError } from 'zod'
import { CartLineType } from '~/components/features/Cart/ui/cart-line-item'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatZodErrors(error: ZodError) {
  return error.errors.reduce((acc: Record<string, string>, error: ZodIssue) => {
    acc[error.path[0]] = error.message
    return acc
  }, {})
}

export function formatTime(time: number) {
  const minutes = Math.floor(time / 60000)
  const seconds = Math.floor((time % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
export function calculateTotal(lines: CartLineType[]) {
  return lines.reduce((acc, line) => acc + Number(line.merchandise.price.amount), 0)
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
// format date into human readable format using intl js api
export const formatDate = (date: string, options?: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    ...options,
  }).format(new Date(date))
}

// split full name

export const splitFullName = (fullName: string) => {
  const nameParts = fullName.split(' ')
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ')
  return { firstName, lastName }
}

export const formatGidToNumericId = (gid: string) => {
  return gid.split('/').pop() as string
}

export function formatShopifyUrl(url: string | undefined | null, liveDomain: string) {
  // Check if url exists and is a string
  if (!url || typeof url !== 'string') {
    return url
  }

  // Make sure liveDomain doesn't already have "https://" or "http://"
  const cleanDomain = liveDomain.replace(/^https?:\/\//i, '')

  // Replace the specific Shopify development URL with the live domain
  return url.replace(/https?:\/\/rbkizy-2g\.myshopify\.com/g, `https://${cleanDomain}`)
}
