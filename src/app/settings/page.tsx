'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import './settings.css';
import PricingModal from '@/components/PricingModal';

export default function SettingsPage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [subscription, setSubscription] = useState<{ status: string; endDate?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState({ used: 0, limit: 3, isSubscribed: false });
  const [showPricing, setShowPricing] = useState(false);
  const [referralData, setReferralData] = useState({ code: '', count: 0, bonusCredits: 0 });
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser({ email: user.email || '' });
        }

        // Get usage
        const usageRes = await fetch('/api/usage');
        if (usageRes.ok) {
          const usageData = await usageRes.json();
          setUsage({
            used: usageData.dailyAnalysesUsed,
            limit: usageData.dailyLimit,
            isSubscribed: usageData.isSubscribed,
          });
          setSubscription({ 
            status: usageData.isSubscribed ? 'active' : 'free' 
          });
        }

        // Get referral data
        const referralRes = await fetch('/api/referral');
        if (referralRes.ok) {
          const referralData = await referralRes.json();
          setReferralData({
            code: referralData.referralCode || '',
            count: referralData.referralCount || 0,
            bonusCredits: referralData.bonusCredits || 0,
          });
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    alert('Subscription cancelled');
  };

  const handleCopyReferral = async () => {
    const referralLink = `${window.location.origin}/auth/signup?ref=${referralData.code}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const remaining = Math.max(0, usage.limit - usage.used);

  if (loading) {
    return (
      <div className="settings-page">
        <header className="settings-header">
          <Link href="/" className="settings-logo">ThisReply</Link>
        </header>
        <div className="loading-container">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      {/* Header */}
      <header className="settings-header">
        <Link href="/" className="settings-logo">ThisReply</Link>
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

      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>

        {/* Account Section */}
        <section className="settings-section">
          <h2 className="settings-section-title">Account</h2>
          <p className="settings-section-content">{user?.email}</p>
        </section>

        {/* Subscription Section */}
        <section className="settings-section">
          <h2 className="settings-section-title">Subscription</h2>
          <div className="settings-row">
            <span className={`subscription-badge ${subscription?.status === 'active' ? 'premium' : 'free'}`}>
              {subscription?.status === 'active' ? '✨ Premium' : '🎁 Free'}
            </span>
            {subscription?.status === 'active' ? (
              <button 
                onClick={handleCancelSubscription}
                className="settings-link danger"
              >
                Cancel
              </button>
            ) : (
              <button onClick={() => setShowPricing(true)} className="settings-link">
                Upgrade →
              </button>
            )}
          </div>
          {subscription?.endDate && (
            <p className="renew-date">
              Renews: {new Date(subscription.endDate).toLocaleDateString()}
            </p>
          )}
        </section>

        {/* Support Section */}
        <section className="settings-section">
          <h2 className="settings-section-title">Support</h2>
          <div className="settings-section-content">
            <a href="mailto:hello@thisreply.app" className="settings-link">
              Contact Support
            </a>
          </div>
        </section>

        {/* Referral Section */}
        <section className="settings-section">
          <h2 className="settings-section-title">Invite Friends</h2>
          <p style={{ color: '#999', fontSize: '14px', marginBottom: '16px' }}>
            Share your referral link and get +2 bonus credits for each friend who signs up!
          </p>
          <div style={{ 
            background: '#1a1a1a', 
            padding: '16px', 
            borderRadius: '12px',
            border: '1px solid #2a2a2a',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#999', fontSize: '14px' }}>Your referral code</span>
              <span style={{ color: '#fff', fontWeight: '600', fontFamily: 'monospace' }}>
                {referralData.code || 'Loading...'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#999', fontSize: '14px' }}>Friends invited</span>
              <span style={{ color: '#fff', fontWeight: '600' }}>{referralData.count}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#999', fontSize: '14px' }}>Bonus credits earned</span>
              <span style={{ color: '#4ade80', fontWeight: '600' }}>+{referralData.bonusCredits}</span>
            </div>
          </div>
          <button 
            onClick={handleCopyReferral}
            style={{
              width: '100%',
              padding: '12px',
              background: copied ? '#4ade80' : '#ff4d6d',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {copied ? '✓ Link Copied!' : '📋 Copy Referral Link'}
          </button>
        </section>

        {/* Logout Button */}
        <button onClick={handleLogout} className="logout-btn">
          Log Out
        </button>
      </div>
    </div>
  );
}
