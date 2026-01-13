import Link from 'next/link';

export default function TermsPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a', 
      padding: '40px 20px',
      color: '#fff'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#ff4d6d', textDecoration: 'none', marginBottom: '32px', display: 'inline-block' }}>
          ← Back to Home
        </Link>
        
        <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>Terms of Service</h1>
        <p style={{ color: '#999', marginBottom: '32px' }}>Last updated: January 13, 2025</p>

        <div style={{ lineHeight: '1.8', color: '#ccc' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#fff' }}>
            1. Acceptance of Terms
          </h2>
          <p style={{ marginBottom: '16px' }}>
            By accessing and using ThisReply, you accept and agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our service.
          </p>

          <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#fff' }}>
            2. Description of Service
          </h2>
          <p style={{ marginBottom: '16px' }}>
            ThisReply is an AI-powered service that analyzes dating conversation screenshots and provides 
            suggested replies. The service is provided &quot;as is&quot; and we make no guarantees about the 
            effectiveness of the suggestions.
          </p>

          <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#fff' }}>
            3. User Accounts
          </h2>
          <p style={{ marginBottom: '16px' }}>
            You are responsible for:
          </p>
          <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
            <li>Maintaining the confidentiality of your account</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
          </ul>

          <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#fff' }}>
            4. Acceptable Use
          </h2>
          <p style={{ marginBottom: '16px' }}>
            You agree NOT to:
          </p>
          <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
            <li>Upload inappropriate, offensive, or illegal content</li>
            <li>Attempt to reverse engineer or hack the service</li>
            <li>Use the service for spam or harassment</li>
            <li>Share your account with others</li>
            <li>Abuse the free tier or create multiple accounts</li>
          </ul>

          <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#fff' }}>
            5. Subscription and Payments
          </h2>
          <p style={{ marginBottom: '16px' }}>
            - Free tier: 2 analyses per day<br />
            - Premium subscriptions are billed weekly or monthly<br />
            - Payments are processed securely through Stripe<br />
            - Refunds are handled on a case-by-case basis<br />
            - You can cancel your subscription at any time
          </p>

          <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#fff' }}>
            6. Content and Privacy
          </h2>
          <p style={{ marginBottom: '16px' }}>
            - Screenshots are processed and immediately deleted<br />
            - We do not store your conversation content<br />
            - AI-generated suggestions are not stored permanently<br />
            - See our Privacy Policy for more details
          </p>

          <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#fff' }}>
            7. Disclaimer
          </h2>
          <p style={{ marginBottom: '16px' }}>
            ThisReply provides AI-generated suggestions for entertainment and assistance purposes. 
            We are not responsible for the outcomes of conversations or relationships. Use suggestions 
            at your own discretion.
          </p>

          <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#fff' }}>
            8. Termination
          </h2>
          <p style={{ marginBottom: '16px' }}>
            We reserve the right to suspend or terminate your account if you violate these terms or 
            engage in abusive behavior.
          </p>

          <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#fff' }}>
            9. Changes to Terms
          </h2>
          <p style={{ marginBottom: '16px' }}>
            We may update these terms from time to time. Continued use of the service after changes 
            constitutes acceptance of the new terms.
          </p>

          <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#fff' }}>
            10. Contact
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Questions about these terms? Contact us at:{' '}
            <a href="mailto:hello@thisreply.app" style={{ color: '#ff4d6d' }}>
              hello@thisreply.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
