'use client';

import { useState } from 'react';
import type { Persona } from '@/types';

interface ResponseCardsProps {
  responses: {
    witty: string[];
    romantic: string[];
    savage: string[];
  };
}

const personas: { key: Persona; label: string; emoji: string }[] = [
  { key: 'witty', label: 'Witty', emoji: '😏' },
  { key: 'romantic', label: 'Romantic', emoji: '💕' },
  { key: 'savage', label: 'Savage', emoji: '🔥' },
];

export default function ResponseCards({ responses }: ResponseCardsProps) {
  const [activePersona, setActivePersona] = useState<Persona>('witty');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const currentResponses = responses[activePersona];

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Persona Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-full">
        {personas.map(({ key, label, emoji }) => (
          <button
            key={key}
            onClick={() => setActivePersona(key)}
            className={`
              flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all
              ${activePersona === key 
                ? 'bg-primary text-white' 
                : 'text-gray-400 hover:text-white'}
            `}
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      {/* Response Cards */}
      <div className="space-y-3">
        {currentResponses.map((response, index) => (
          <div
            key={index}
            onClick={() => handleCopy(response, index)}
            className="p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all active:scale-[0.98]"
          >
            <p className="text-base leading-relaxed">{response}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">Tap to copy</span>
              {copiedIndex === index && (
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
