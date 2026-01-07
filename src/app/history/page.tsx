'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './history.css';
import PricingModal from '@/components/PricingModal';

interface AnalysisHistory {
  id: string;
  contextSummary: string;
  response: string;
  createdAt: string;
}

type SortOption = 'newest' | 'oldest';

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<AnalysisHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [usage, setUsage] = useState({ used: 0, limit: 3, isSubscribed: false });
  const [showPricing, setShowPricing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Haptic feedback
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch history and usage in parallel
        const [historyRes, usageRes] = await Promise.all([
          fetch('/api/history'),
          fetch('/api/usage'),
        ]);

        if (historyRes.ok) {
          const historyData = await historyRes.json();
          // Transform API response to match our interface
          const transformed = (historyData.analyses || []).map((a: {
            id: string;
            context_summary: string;
            responses: { witty?: string[]; romantic?: string[]; savage?: string[] };
            created_at: string;
          }) => ({
            id: a.id,
            contextSummary: a.context_summary || '',
            // Get first response from any category
            response: a.responses?.witty?.[0] || a.responses?.romantic?.[0] || a.responses?.savage?.[0] || '',
            createdAt: a.created_at,
          }));
          setAnalyses(transformed);
        }

        if (usageRes.ok) {
          const usageData = await usageRes.json();
          setUsage({
            used: usageData.dailyAnalysesUsed,
            limit: usageData.dailyLimit,
            isSubscribed: usageData.isSubscribed,
          });
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    triggerHaptic();
    
    // Optimistic update
    setAnalyses(analyses.filter(a => a.id !== id));
    
    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        // Revert on error - refetch
        const historyRes = await fetch('/api/history');
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          const transformed = (historyData.analyses || []).map((a: {
            id: string;
            context_summary: string;
            responses: { witty?: string[]; romantic?: string[]; savage?: string[] };
            created_at: string;
          }) => ({
            id: a.id,
            contextSummary: a.context_summary || '',
            response: a.responses?.witty?.[0] || a.responses?.romantic?.[0] || a.responses?.savage?.[0] || '',
            createdAt: a.created_at,
          }));
          setAnalyses(transformed);
        }
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleCopy = async (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      triggerHaptic();
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sortedAnalyses = [...analyses].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const remaining = Math.max(0, usage.limit - usage.used);

  if (loading) {
    return (
      <div className="history-page">
        <header className="history-header">
          <Link href="/" className="history-logo">ThisReply</Link>
        </header>
        <div className="history-container">
          <h1 className="history-title">History</h1>
          <div className="history-list">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-header">
                  <div className="skeleton-avatar"></div>
                  <div className="skeleton-lines">
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line"></div>
                  </div>
                </div>
                <div className="skeleton-content">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line medium"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      {/* Header */}
      <header className="history-header">
        <Link href="/" className="history-logo">ThisReply</Link>
        <button onClick={() => setShowPricing(true)} className={`usage-badge ${usage.isSubscribed ? 'premium' : ''}`}>
          {usage.isSubscribed ? (
            <>✨ Unlimited</>
          ) : (
            <>{remaining} credits left ⚡</>
          )}
        </button>
      </header>

      {/* Pricing Modal */}
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />

      <div className="history-container">
        <div className="history-top">
          <h1 className="history-title">History</h1>
          {analyses.length > 0 && (
            <div className="sort-dropdown">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="sort-select"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          )}
        </div>

        {analyses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-title">No analyses yet</p>
            <p className="empty-subtitle">Your past responses will appear here</p>
            <Link href="/dashboard" className="empty-cta">
              📸 Analyze a Screenshot
            </Link>
          </div>
        ) : (
          <div className="history-list">
            {sortedAnalyses.map((analysis) => (
              <div key={analysis.id} className={`history-card ${copiedId === analysis.id ? 'copied' : ''}`}>
                <div className="history-card-context">
                  💡 {analysis.contextSummary}
                </div>
                <div className="history-card-response">
                  {analysis.response}
                </div>
                <div className="history-card-footer">
                  <span className="history-card-date">
                    {new Date(analysis.createdAt).toLocaleDateString()}
                  </span>
                  <div className="history-card-actions">
                    <button
                      onClick={(e) => handleCopy(e, analysis.response, analysis.id)}
                      className={`history-card-copy ${copiedId === analysis.id ? 'copied' : ''}`}
                    >
                      {copiedId === analysis.id ? '✓ Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, analysis.id)}
                      className="history-card-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
