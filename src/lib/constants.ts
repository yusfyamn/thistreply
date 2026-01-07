export const FREE_DAILY_LIMIT = 2;

export const SUBSCRIPTION_PLANS = [
  {
    id: 'weekly',
    name: 'Weekly',
    price: 4.99,
    interval: 'week' as const,
    stripePriceId: process.env.STRIPE_WEEKLY_PRICE_ID || '',
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 9.99,
    interval: 'month' as const,
    stripePriceId: process.env.STRIPE_MONTHLY_PRICE_ID || '',
  },
];

export const SUPPORTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/heic'];
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB

export const HISTORY_RETENTION_DAYS = {
  free: 30,
  subscribed: 90,
};
