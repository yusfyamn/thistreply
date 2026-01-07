import { createClient } from '@/lib/supabase/server';
import { analyzeScreenshot } from '@/lib/openai';
import { NextResponse } from 'next/server';
import { FREE_DAILY_LIMIT } from '@/lib/constants';

// Admin emails have unlimited access
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Please log in to continue' }, { status: 401 });
    }

    // Check if user is admin (unlimited access)
    const userIsAdmin = isAdmin(user.email);

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check daily reset (skip for admins)
    const today = new Date().toISOString().split('T')[0];
    let dailyUsed = profile.daily_analyses_used;
    
    if (profile.daily_reset_date !== today) {
      // Reset daily count
      await supabase
        .from('profiles')
        .update({ daily_analyses_used: 0, daily_reset_date: today })
        .eq('id', user.id);
      dailyUsed = 0;
    }

    // Check usage limits for free users (admins bypass this)
    if (!userIsAdmin && profile.subscription_status !== 'active' && dailyUsed >= FREE_DAILY_LIMIT) {
      return NextResponse.json(
        { error: 'Daily limit reached', upgradeUrl: '/pricing' },
        { status: 429 }
      );
    }

    // Get image from request
    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert to base64
    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    // Analyze with OpenAI
    const aiResponse = await analyzeScreenshot(base64);

    // Save to history
    const { data: analysis, error: saveError } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        responses: {
          witty: aiResponse.witty,
          romantic: aiResponse.romantic,
          savage: aiResponse.savage,
        },
        context_summary: aiResponse.contextSummary,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Failed to save analysis:', saveError);
    }

    // Increment usage for free users (skip for admins)
    if (!userIsAdmin && profile.subscription_status !== 'active') {
      await supabase
        .from('profiles')
        .update({ daily_analyses_used: dailyUsed + 1 })
        .eq('id', user.id);
    }

    return NextResponse.json({
      id: analysis?.id,
      responses: aiResponse,
      contextSummary: aiResponse.contextSummary,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Handle non-dating content
    if (errorMessage === 'NOT_DATING_CONTENT') {
      return NextResponse.json(
        { error: 'Please upload a dating app conversation screenshot' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Could not process image', details: errorMessage },
      { status: 500 }
    );
  }
}
