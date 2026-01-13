import { requireAdmin } from '@/lib/admin';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  await requireAdmin();
  
  const supabase = await createClient();
  
  // Get total users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  
  // Get total analyses
  const { count: totalAnalyses } = await supabase
    .from('analyses')
    .select('*', { count: 'exact', head: true });
  
  // Get today's analyses
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { count: todayAnalyses } = await supabase
    .from('analyses')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());
  
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

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Analytics Dashboard</h1>
        <p className="admin-subtitle">Overview of your application metrics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{totalUsers || 0}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Subscribed Users</div>
          <div className="stat-value">{subscribedUsers || 0}</div>
          <div className="stat-change">
            {totalUsers ? Math.round((subscribedUsers || 0) / totalUsers * 100) : 0}% conversion
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Analyses</div>
          <div className="stat-value">{totalAnalyses || 0}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Today&apos;s Analyses</div>
          <div className="stat-value">{todayAnalyses || 0}</div>
        </div>
      </div>

      <div className="admin-section">
        <h2 className="section-title">Recent Activity</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Date</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {recentAnalyses?.map((analysis: any) => (
              <tr key={analysis.id}>
                <td>{analysis.profiles?.email || 'Unknown'}</td>
                <td>{new Date(analysis.created_at).toLocaleString()}</td>
                <td className="text-gray-500">{analysis.id.slice(0, 8)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
