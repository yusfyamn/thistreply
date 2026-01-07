'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import './dashboard.css';
import PricingModal from '@/components/PricingModal';

interface AnalysisResult {
  response: string;
  contextSummary: string;
  allResponses?: {
    witty: string[];
    romantic: string[];
    savage: string[];
  };
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [usage, setUsage] = useState({ used: 0, limit: 3, isSubscribed: false });
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastFileRef = useRef<File | null>(null);
  const allResponsesRef = useRef<string[]>([]);
  const currentIndexRef = useRef(0);

  // Fetch usage on mount
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await fetch('/api/usage');
        if (res.ok) {
          const data = await res.json();
          setUsage({
            used: data.dailyAnalysesUsed,
            limit: data.dailyLimit,
            isSubscribed: data.isSubscribed,
          });
        }
      } catch (err) {
        console.error('Failed to fetch usage:', err);
      }
    };
    fetchUsage();
  }, []);

  // Haptic feedback
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleUpload = async (file: File | Blob) => {
    // File size check
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 5MB');
      return;
    }

    if (file instanceof File) {
      lastFileRef.current = file;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError('Daily limit reached. Upgrade for more!');
          setShowPricing(true);
        } else {
          setError(data.error || 'Something went wrong');
        }
        setLoading(false);
        return;
      }

      // Collect all responses into a flat array
      const responses = data.responses;
      const allResp = [
        ...(responses.witty || []),
        ...(responses.romantic || []),
        ...(responses.savage || []),
      ];
      
      allResponsesRef.current = allResp;
      currentIndexRef.current = 0;

      setResult({
        response: allResp[0] || 'No response generated',
        contextSummary: data.contextSummary || responses.contextSummary,
        allResponses: responses,
      });

      // Update usage
      if (!usage.isSubscribed) {
        setUsage(prev => ({ ...prev, used: prev.used + 1 }));
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    triggerHaptic();
    
    // Cycle through existing responses first
    if (allResponsesRef.current.length > 1) {
      currentIndexRef.current = (currentIndexRef.current + 1) % allResponsesRef.current.length;
      setResult(prev => prev ? {
        ...prev,
        response: allResponsesRef.current[currentIndexRef.current],
      } : null);
      return;
    }

    // If only one response or need new ones, re-analyze
    if (!lastFileRef.current) return;
    
    setIsRegenerating(true);
    
    try {
      const formData = new FormData();
      formData.append('image', lastFileRef.current);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const responses = data.responses;
        const allResp = [
          ...(responses.witty || []),
          ...(responses.romantic || []),
          ...(responses.savage || []),
        ];
        
        allResponsesRef.current = allResp;
        currentIndexRef.current = 0;

        setResult({
          response: allResp[0] || 'No response generated',
          contextSummary: data.contextSummary || responses.contextSummary,
          allResponses: responses,
        });

        if (!usage.isSubscribed) {
          setUsage(prev => ({ ...prev, used: prev.used + 1 }));
        }
      }
    } catch (err) {
      console.error('Regenerate error:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      triggerHaptic();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError('');
    lastFileRef.current = null;
  };

  const remaining = Math.max(0, usage.limit - usage.used);

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <Link href="/" className="dashboard-logo">ThisReply</Link>
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

      {/* Main Content */}
      {loading ? (
        <div className="loading-container">
          <div className="skeleton-card">
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
          <p className="loading-text">Analyzing your chat...</p>
          <p className="loading-subtext">Our AI is crafting the perfect response</p>
        </div>
      ) : result ? (
        <div className="result-container">
          <h1 className="dashboard-title">Your Reply</h1>
          
          {result.contextSummary && (
            <div className="context-summary">
              💡 {result.contextSummary}
            </div>
          )}

          {/* Single Response Card */}
          <div 
            className={`response-card ${copied ? 'copied' : ''}`}
            onClick={() => handleCopy(result.response)}
          >
            <p className="response-text">{result.response}</p>
            <div className="response-footer">
              {copied ? (
                <span className="copied-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </span>
              ) : (
                <span className="copy-hint">Tap to copy</span>
              )}
            </div>
            {copied && <div className="copy-success-overlay">✓</div>}
          </div>

          <div className="result-actions">
            <button 
              onClick={handleRegenerate} 
              className="regenerate-btn"
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <span className="btn-spinner"></span>
                  Generating...
                </>
              ) : (
                <>🔄 Try Another</>
              )}
            </button>
            <button onClick={handleReset} className="analyze-another-btn">
              📸 New Screenshot
            </button>
          </div>
        </div>
      ) : (
        <div className="upload-container">
          <h1 className="dashboard-title">Upload Screenshot</h1>
          <p className="dashboard-subtitle">Get the perfect reply in seconds</p>

          <div
            className={`upload-area ${isDragging ? 'dragging' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/heic"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div className="upload-icon">📸</div>
            <p className="upload-title desktop-only">Drop your screenshot here</p>
            <p className="upload-title mobile-only">Tap to upload screenshot</p>
            <p className="upload-subtitle desktop-only">or tap to select from gallery</p>
            <p className="upload-subtitle mobile-only">Select from your gallery</p>
            <p className="upload-hint">PNG, JPG, HEIC • Max 5MB</p>
          </div>

          <p className="privacy-notice">🔒 Screenshots auto-deleted. No data stored.</p>

          {error && <div className="error-message">{error}</div>}

          {!usage.isSubscribed && remaining === 0 && (
            <button 
              onClick={() => setShowPricing(true)} 
              className="upgrade-btn"
            >
              ⚡ Upgrade for More
            </button>
          )}
        </div>
      )}
    </div>
  );
}
