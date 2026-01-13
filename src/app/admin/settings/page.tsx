'use client';

import { useState } from 'react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    freeCredits: 2,
    maxFileSize: 5,
    rateLimit: 10,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    // TODO: Save to database or config
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">System Settings</h1>
        <p className="admin-subtitle">Configure application parameters</p>
      </div>

      <div className="admin-section">
        <h2 className="section-title">Usage Limits</h2>
        
        <div style={{ maxWidth: '500px' }}>
          <label className="admin-label">
            Free Daily Credits
          </label>
          <input
            type="number"
            className="admin-input"
            value={settings.freeCredits}
            onChange={(e) => setSettings({ ...settings, freeCredits: parseInt(e.target.value) })}
          />

          <label className="admin-label">
            Max File Size (MB)
          </label>
          <input
            type="number"
            className="admin-input"
            value={settings.maxFileSize}
            onChange={(e) => setSettings({ ...settings, maxFileSize: parseInt(e.target.value) })}
          />

          <label className="admin-label">
            Rate Limit (requests per minute)
          </label>
          <input
            type="number"
            className="admin-input"
            value={settings.rateLimit}
            onChange={(e) => setSettings({ ...settings, rateLimit: parseInt(e.target.value) })}
          />

          <button 
            className="admin-btn" 
            onClick={handleSave}
            style={{ 
              background: saved ? '#4ade80' : '#ff4d6d',
              border: 'none',
              marginTop: '8px'
            }}
          >
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="admin-section">
        <h2 className="section-title">Environment Variables</h2>
        <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px' }}>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#999' }}>OPENAI_API_KEY:</span>{' '}
            <span style={{ color: '#4ade80' }}>✓ Set</span>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#999' }}>SUPABASE_URL:</span>{' '}
            <span style={{ color: '#4ade80' }}>✓ Set</span>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#999' }}>STRIPE_SECRET_KEY:</span>{' '}
            <span style={{ color: '#f87171' }}>✗ Not Set</span>
          </div>
          <div>
            <span style={{ color: '#999' }}>ADMIN_EMAILS:</span>{' '}
            <span style={{ color: '#4ade80' }}>✓ Set</span>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <h2 className="section-title">Danger Zone</h2>
        <p style={{ color: '#999', marginBottom: '16px', fontSize: '14px' }}>
          These actions are irreversible. Please be careful.
        </p>
        <button className="admin-btn danger">
          Clear All Analytics Data
        </button>
      </div>
    </div>
  );
}
