// Admin utilities
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function isAdmin(): Promise<boolean> {
  const cookieStore = cookies();
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user?.email) return false;
  
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
  
  return adminEmails.includes(user.email);
}

export async function requireAdmin() {
  const admin = await isAdmin();
  
  if (!admin) {
    throw new Error('Unauthorized: Admin access required');
  }
  
  return true;
}
