import { requireAdmin } from '@/lib/admin';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  await requireAdmin();
  
  const supabase = await createClient();
  
  // Date ranges
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  
  // Get total users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  
  // Get new users this week
  const { count: weekUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', weekAgo.toISOString());
  
  // Get total analyses
  const { count: totalAnalyses } = await supabase
    .from('analyses')
    .select('*', { count: 'exact', head: true });
  
  // Get today's analyses
  const { count: todayAnalyses } = await supabase
    .from('analyses')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());
  
  // Get this week's analyses
  const { count: weekAnalyses } = await supabase
    .from('analyses')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', weekAgo.toISOString());
  
  // Get this month's analyses
  const { count: monthAnalyses } = await supabase
    .from('analyses')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', monthAgo.toISOString());
  
  // Get subscribed users
  const { count: subscribedUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_subscribed', true);
  
  // Get recent analyses
  const { data: recentAnalyses } = await supabase
    .from('analyses')
    .select(`
      id,
      created_at,
      profiles (
        email
      )
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  const conversionRate = totalUsers ? Math.round((subscribedUsers || 0) / totalUsers * 100) : 0;

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Analytics Dashboard</h1>
          <p className="admin-subtitle">Real-time overview of your application</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{totalUsers || 0}</div>
          <div className="stat-change">
            +{weekUsers || 0} this week
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✨</div>
          <div className="stat-label">Premium Users</div>
          <div className="stat-value">{subscribedUsers || 0}</div>
          <div className="stat-change">
            {conversionRate}% conversion rate
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-label">Total Analyses</div>
          <div className="stat-value">{totalAnalyses || 0}</div>
          <div className="stat-change">
            +{weekAnalyses || 0} this week
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-label">Today&apos;s Activity</div>
          <div className="stat-value">{todayAnalyses || 0}</div>
          <div className="stat-change">
            {monthAnalyses || 0} this month
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="admin-section">
          <h2 className="section-title">Usage Breakdown</h2>
          <div style={{ padding: '20px 0' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#999', fontSize: '14px' }}>Today</span>
                <span style={{ color: '#fff', fontWeight: '600' }}>{todayAnalyses || 0}</span>
              </div>
              <div style={{ 
                height: '8px', 
                background: '#2a2a2a', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  height: '100%', 
                  width: `${Math.min((todayAnalyses || 0) / Math.max(weekAnalyses || 1, 1) * 100, 100)}%`,
                  background: 'linear-gradient(90deg, #ff4d6d, #ff6b88)',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#999', fontSize: '14px' }}>This Week</span>
                <span style={{ color: '#fff', fontWeight: '600' }}>{weekAnalyses || 0}</span>
              </div>
              <div style={{ 
                height: '8px', 
                background: '#2a2a2a', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  height: '100%', 
                  width: `${Math.min((weekAnalyses || 0) / Math.max(monthAnalyses || 1, 1) * 100, 100)}%`,
                  background: 'linear-gradient(90deg, #4ade80, #22c55e)',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#999', fontSize: '14px' }}>This Month</span>
                <span style={{ color: '#fff', fontWeight: '600' }}>{monthAnalyses || 0}</span>
              </div>
              <div style={{ 
                height: '8px', 
                background: '#2a2a2a', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  height: '100%', 
                  width: '100%',
                  background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <h2 className="section-title">Quick Stats</h2>
          <div style={{ padding: '20px 0' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '16px 0',
              borderBottom: '1px solid #2a2a2a'
            }}>
              <span style={{ color: '#999' }}>Avg. per user</span>
              <span style={{ color: '#fff', fontWeight: '600' }}>
                {totalUsers ? ((totalAnalyses || 0) / totalUsers).toFixed(1) : '0'}
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '16px 0',
              borderBottom: '1px solid #2a2a2a'
            }}>
              <span style={{ color: '#999' }}>Free users</span>
              <span style={{ color: '#fff', fontWeight: '600' }}>
                {(totalUsers || 0) - (subscribedUsers || 0)}
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '16px 0'
            }}>
              <span style={{ color: '#999' }}>Revenue potential</span>
              <span style={{ color: '#4ade80', fontWeight: '600' }}>
                ${((subscribedUsers || 0) * 9.99).toFixed(2)}/mo
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <h2 className="section-title">Recent Activity</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Date & Time</th>
              <th>Analysis ID</th>
            </tr>
          </thead>
          <tbody>
            {recentAnalyses?.map((analysis: any) => (
              <tr key={analysis.id}>
                <td>{analysis.profiles?.email || 'Unknown'}</td>
                <td>{new Date(analysis.created_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</td>
                <td style={{ color: '#666', fontFamily: 'monospace', fontSize: '13px' }}>
                  {analysis.id.slice(0, 8)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
