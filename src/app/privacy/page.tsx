import Link from 'next/link';

export default function PrivacyPage() {
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
        
        <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>Privacy Policy</h1>
        <p style={{ color: '#999', marginBottom: '32px' }}>Last updated: January 13, 2025</p>

        <div style={{ lineHeight: '1.8', color: '#ccc' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#fff' }}>
            1. Information We Collect
          </h2>
          <p style={{ marginBottom: '16px' }}>
            We collect information you provide directly to us, including:
          </p>
          <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
            <li>Email address (for account creation)</li>
            <li>Screenshots you upload (temporarily processed, then deleted)</li>
            <li>Usage data (number of analyses, subscription status)</li>
          </ul>

          <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#fff' }}>
            2. How We Use Your Information
          </h2>
          <p style={{ marginBottom: '16px' }}>
            We use the information we collect to:
          </p>
          <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
            <li>Provide and improve our AI-powered reply suggestions</li>
            <li>Process your subscription payments</li>
            <li>Send you service-related communications</li>
            <li>Monitor and analyze usage patterns</li>
          </ul>

          <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#fff' }}>
            3. Data Security
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Your screenshots are processed in real-time and automatically deleted after analysis. 
            We do not store your conversation screenshots permanently. All data is encrypted in transit and at rest.
          </p>

          <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#fff' }}>
            4. Third-Party Services
          </h2>
          <p style={{ marginBottom: '16px' }}>
            We use the following third-party services:
          </p>
          <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
            <li><strong>OpenAI:</strong> For AI-powered reply generation</li>
            <li><strong>Supabase:</strong> For authentication and database</li>
            <li><strong>Stripe:</strong> For payment processing</li>
            <li><strong>Vercel:</strong> For hosting</li>
          </ul>

          <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#fff' }}>
            5. Your Rights
          </h2>
          <p style={{ marginBottom: '16px' }}>
            You have the right to:
          </p>
          <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
            <li>Access your personal data</li>
            <li>Request deletion of your account and data</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your data</li>
          </ul>

          <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#fff' }}>
            6. Contact Us
          </h2>
          <p style={{ marginBottom: '16px' }}>
            If you have any questions about this Privacy Policy, please contact us at:{' '}
            <a href="mailto:hello@thisreply.app" style={{ color: '#ff4d6d' }}>
              hello@thisreply.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
