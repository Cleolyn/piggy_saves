import type { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  PHP: { code: 'PHP', symbol: '₱', label: 'PHP (₱) - Philippine Peso', locale: 'en-PH' },
  USD: { code: 'USD', symbol: '$', label: 'USD ($) - US Dollar', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', label: 'EUR (€) - Euro', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', label: 'GBP (£) - British Pound', locale: 'en-GB' },
  JPY: { code: 'JPY', symbol: '¥', label: 'JPY (¥) - Japanese Yen', locale: 'ja-JP' },
  SGD: { code: 'SGD', symbol: 'S$', label: 'SGD (S$) - Singapore Dollar', locale: 'en-SG' },
};

/**
 * Format a number into currency with symbol
 */
export function formatCurrency(amount: number, currencyCode: CurrencyCode = 'PHP'): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.PHP;
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${config.symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

/**
 * Format an ISO timestamp to exact standard "YYYY-MM-DD HH:mm:ss"
 */
export function formatExactTimestamp(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';

  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Format an ISO string to input[type="datetime-local"] format: "YYYY-MM-DDTHH:mm"
 */
export function toDateTimeLocalString(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Parse datetime-local string to ISO 8601 string
 */
export function fromDateTimeLocalToISO(dateTimeLocalStr: string): string {
  if (!dateTimeLocalStr) return new Date().toISOString();
  const date = new Date(dateTimeLocalStr);
  if (isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

/**
 * Friendly human-readable relative/concise date format
 */
export function formatFriendlyDate(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Invalid Date';

  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isToday) {
    return `Today, ${timeStr}`;
  }
  if (isYesterday) {
    return `Yesterday, ${timeStr}`;
  }

  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  }) + ` · ${timeStr}`;
}
