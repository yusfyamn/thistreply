import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user's referral code
  const { data: profile } = await supabase
    .from('profiles')
    .select('referral_code, referral_count, bonus_credits')
    .eq('id', user.id)
    .single();

  return NextResponse.json({
    referralCode: profile?.referral_code,
    referralCount: profile?.referral_count || 0,
    bonusCredits: profile?.bonus_credits || 0,
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { referralCode } = await request.json();

  if (!referralCode) {
    return NextResponse.json({ error: 'Referral code required' }, { status: 400 });
  }

  // Find referrer
  const { data: referrer } = await supabase
    .from('profiles')
    .select('id, referral_count, bonus_credits')
    .eq('referral_code', referralCode)
    .single();

  if (!referrer) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
  }

  // Check if user already used a referral
  const { data: currentUser } = await supabase
    .from('profiles')
    .select('referred_by')
    .eq('id', user.id)
    .single();

  if (currentUser?.referred_by) {
    return NextResponse.json({ error: 'Already used a referral code' }, { status: 400 });
  }

  // Update referrer: +1 referral count, +2 bonus credits
  await supabase
    .from('profiles')
    .update({
      referral_count: (referrer.referral_count || 0) + 1,
      bonus_credits: (referrer.bonus_credits || 0) + 2,
    })
    .eq('id', referrer.id);

  // Update current user: mark as referred, +2 bonus credits
  await supabase
    .from('profiles')
    .update({
      referred_by: referrer.id,
      bonus_credits: 2,
    })
    .eq('id', user.id);

  return NextResponse.json({ 
    success: true,
    bonusCredits: 2,
  });
}
