'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import './PricingModal.css';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="pricing-modal-overlay" onClick={onClose}>
      <div className="pricing-modal" onClick={(e) => e.stopPropagation()}>
        <button className="pricing-modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="pricing-modal-header">
          <h2>Simple pricing</h2>
          <p>Choose your plan and start getting better replies.</p>
        </div>

        <div className="pricing-modal-cards two-cards">
          {/* Weekly Card */}
          <div className="pricing-card weekly-card">
            <div className="popular-badge">Best Value</div>
            <div className="pricing-card-header">
              <h3>Weekly</h3>
              <div className="pricing-price-wrap">
                <span className="pricing-price">$4.90</span>
                <span className="pricing-period">/week</span>
              </div>
            </div>
            <p className="pricing-desc">Perfect for trying it out.</p>
            <ul className="pricing-features">
              <li><span className="arrow-icon">→</span> Unlimited analyses</li>
              <li><span className="arrow-icon">→</span> All tone adjustments</li>
              <li><span className="arrow-icon">→</span> Cancel anytime</li>
            </ul>
            <Link href="/checkout?plan=weekly" className="pricing-btn pricing-btn-primary">
              Get Weekly
            </Link>
          </div>

          {/* 100 Pack Card */}
          <div className="pricing-card pack-card">
            <div className="pricing-card-header">
              <h3>100 Pack</h3>
              <div className="pricing-price-wrap">
                <span className="pricing-price">$14.90</span>
                <span className="pricing-period">one-time</span>
              </div>
            </div>
            <p className="pricing-desc">Pay once, use whenever you need.</p>
            <ul className="pricing-features">
              <li><span className="arrow-icon">→</span> 100 conversations</li>
              <li><span className="arrow-icon">→</span> Never expires</li>
              <li><span className="arrow-icon">→</span> All features included</li>
            </ul>
            <Link href="/checkout?plan=pack" className="pricing-btn pricing-btn-secondary">
              Buy Pack
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
