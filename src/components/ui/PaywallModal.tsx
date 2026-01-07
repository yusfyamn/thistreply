'use client';

import Link from 'next/link';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-3xl">🔒</span>
          </div>

          <h2 className="text-xl font-bold">Daily Limit Reached</h2>
          
          <p className="text-gray-400 text-sm">
            You&apos;ve used all 2 free analyses for today. Upgrade to get unlimited access!
          </p>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Link
            href="/pricing"
            className="block w-full py-3 bg-primary hover:bg-primary-dark rounded-xl font-medium text-center transition-colors"
          >
            Upgrade Now
          </Link>
          
          <button
            onClick={onClose}
            className="block w-full py-3 text-gray-400 hover:text-white text-sm transition-colors"
          >
            Come back tomorrow
          </button>
        </div>

        {/* Timer hint */}
        <p className="text-xs text-gray-500 text-center">
          Free analyses reset at midnight UTC
        </p>
      </div>
    </div>
  );
}
