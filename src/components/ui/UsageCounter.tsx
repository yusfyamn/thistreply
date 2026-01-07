'use client';

import { FREE_DAILY_LIMIT } from '@/lib/constants';

interface UsageCounterProps {
  used: number;
  isSubscribed: boolean;
}

export default function UsageCounter({ used, isSubscribed }: UsageCounterProps) {
  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 rounded-full">
        <span className="text-xs font-medium text-primary">✨ Unlimited</span>
      </div>
    );
  }

  const remaining = Math.max(0, FREE_DAILY_LIMIT - used);
  const percentage = (remaining / FREE_DAILY_LIMIT) * 100;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full">
      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all ${
            remaining === 0 ? 'bg-red-500' : remaining === 1 ? 'bg-yellow-500' : 'bg-primary'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-400">
        {remaining}/{FREE_DAILY_LIMIT}
      </span>
    </div>
  );
}
