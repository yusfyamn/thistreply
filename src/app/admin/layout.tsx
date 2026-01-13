import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin';
import Link from 'next/link';
import './admin.css';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();
  
  if (!admin) {
    redirect('/dashboard');
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Link href="/dashboard">ThisReply</Link>
          <span className="admin-badge">Admin</span>
        </div>
        
        <nav className="admin-nav">
          <Link href="/admin" className="admin-nav-item">
            📊 Analytics
          </Link>
          <Link href="/admin/users" className="admin-nav-item">
            👥 Users
          </Link>
          <Link href="/admin/settings" className="admin-nav-item">
            ⚙️ Settings
          </Link>
        </nav>
        
        <div className="admin-footer">
          <Link href="/dashboard" className="back-link">
            ← Back to App
          </Link>
        </div>
      </aside>
      
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
