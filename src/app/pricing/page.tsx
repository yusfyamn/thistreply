'use client';

import { useState } from 'react';

const plans = [
  {
    id: 'weekly',
    name: 'Weekly',
    price: 4.99,
    period: 'week',
    features: ['Unlimited analyses', 'All personas', '90-day history'],
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 9.99,
    period: 'month',
    popular: true,
    features: ['Unlimited analyses', 'All personas', '90-day history', 'Save 50%'],
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    
    try {
      const res = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Upgrade to Unlimited</h1>
          <p className="text-gray-400 mt-2">Get unlimited access to all features</p>
        </div>

        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-6 rounded-2xl border ${
                plan.popular 
                  ? 'border-primary bg-primary/5' 
                  : 'border-white/10 bg-white/5'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-xs font-medium rounded-full">
                  Most Popular
                </span>
              )}

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">Billed {plan.period}ly</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading !== null}
                className={`w-full py-3 rounded-xl font-medium transition-colors ${
                  plan.popular
                    ? 'bg-primary hover:bg-primary-dark'
                    : 'bg-white/10 hover:bg-white/20'
                } disabled:opacity-50`}
              >
                {loading === plan.id ? 'Loading...' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-500">
          Cancel anytime. Secure payment via Stripe.
        </p>
      </div>
    </main>
  );
}
