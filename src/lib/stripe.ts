import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

export const PLANS = {
  weekly: {
    name: 'Weekly',
    price: 4.99,
    priceId: process.env.STRIPE_WEEKLY_PRICE_ID!,
  },
  monthly: {
    name: 'Monthly',
    price: 9.99,
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
  },
};
