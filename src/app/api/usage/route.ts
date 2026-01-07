import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { FREE_DAILY_LIMIT } from '@/lib/constants';

// Admin emails have unlimited access
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const userIsAdmin = isAdmin(user.email);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('daily_analyses_used, daily_reset_date, subscription_status')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check if daily reset is needed
    const today = new Date().toISOString().split('T')[0];
    let dailyUsed = profile.daily_analyses_used;
    
    if (profile.daily_reset_date !== today) {
      dailyUsed = 0;
    }

    // Admins are treated as subscribed (unlimited)
    const isSubscribed = userIsAdmin || profile.subscription_status === 'active';

    return NextResponse.json({
      dailyAnalysesUsed: dailyUsed,
      dailyLimit: FREE_DAILY_LIMIT,
      isSubscribed,
      remainingAnalyses: isSubscribed ? Infinity : Math.max(0, FREE_DAILY_LIMIT - dailyUsed),
    });
  } catch (error) {
    console.error('Usage error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
