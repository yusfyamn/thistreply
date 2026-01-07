'use client';

import Link from 'next/link';
import './landing.css';

export default function Home() {
  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <Link href="/" className="nav-logo"><span className="nav-logo-text">ThisReply</span></Link>
        <Link href="/auth/signup" className="nav-btn">Try free</Link>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-phone">
          <div className="phone-frame">
            <img src="/images/image-url--screen.jpg-w-640-q-90" alt="ThisReply app interface preview" />
          </div>
          {/* Floating Tags */}
          <div className="floating-tags">
            <div className="floating-tag tag-1">
              <span className="tag-emoji">💬</span>
              <span className="tag-text">Perfect reply</span>
            </div>
            <div className="floating-tag tag-2">
              <span className="tag-emoji">💕</span>
              <span className="tag-text">More dates</span>
            </div>
            <div className="floating-tag tag-3">
              <span className="tag-emoji">✨</span>
              <span className="tag-text">AI powered</span>
            </div>
            <div className="floating-tag tag-4">
              <span className="tag-emoji">🔒</span>
              <span className="tag-text">Private</span>
            </div>
          </div>
        </div>
        <div className="hero-clouds">
          <img src="/images/cloud_left.svg" alt="" className="cloud cloud-left" />
          <img src="/images/cloud_right.svg" alt="" className="cloud cloud-right" />
        </div>
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="line">Send the</span>
            <span className="line highlight">Right Reply</span>
          </h1>
          <p className="hero-tagline">AI picks the perfect reply. You just send.</p>
          <div>
            <Link href="/auth/signup" className="btn btn-download">
              <span className="cta-text">Get Your Reply Now</span>
              <span className="cta-badge">Free</span>
            </Link>
          </div>
          <p className="hero-trust">47,000+ replies sent · 94% get replies back</p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* FEATURE SECTION */}
        <section className="features-section">
          <div className="feature">
            <div className="feature-image">
              <img src="/images/image-url--illos-feature2.jpg-w-1080-q-75" alt="ThisReply AI response" />
            </div>
            <div className="feature-content yellow-theme">
              <h2>One perfect reply</h2>
              <p>No more &quot;which one should I pick?&quot; AI analyzes the conversation and gives you the best response.</p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta-section">
          <div className="final-cta-content">
            <h2>Ready to get <br className="mobile-break" />more dates?</h2>
            <p>Try it free. No credit card needed.</p>
            <Link href="/auth/signup" className="final-cta-btn">
              <span>Get Your Reply Now</span>
              <span className="final-cta-badge">Free</span>
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="styles_footer__ORjCf">
        <div className="footer-simple">
          <span className="footer-big-logo">ThisReply</span>
          <div className="footer-legal-links">
            <Link href="/privacy">Privacy</Link>
            <span className="footer-divider">·</span>
            <Link href="/terms">Terms</Link>
            <span className="footer-divider">·</span>
            <a href="mailto:hello@thisreply.app">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
