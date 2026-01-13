import { requireAdmin } from '@/lib/admin';
import { createClient } from '@/lib/supabase/server';

export default async function AdminUsers() {
  await requireAdmin();
  
  const supabase = createClient();
  
  // Get all users with their usage stats
  const { data: users } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      created_at,
      is_subscribed,
      subscription_status,
      daily_analyses_used,
      last_analysis_date
    `)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">User Management</h1>
        <p className="admin-subtitle">Manage all registered users</p>
      </div>

      <div className="admin-section">
        <h2 className="section-title">All Users ({users?.length || 0})</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Daily Usage</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user: any) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>
                  {user.is_subscribed ? (
                    <span style={{ color: '#4ade80' }}>✓ Subscribed</span>
                  ) : (
                    <span style={{ color: '#999' }}>Free</span>
                  )}
                </td>
                <td>{user.daily_analyses_used || 0} / {user.is_subscribed ? '∞' : '2'}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="admin-btn">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
