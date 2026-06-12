import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hashPassword, checkRateLimit, generateJWT } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'User account is disabled' },
        { status: 401 }
      );
    }

    // Verify password (in production, use bcrypt)
    if (hashPassword(password) !== user.password_hash) {
      // Log failed attempt
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'LOGIN_FAILED',
        resource_type: 'user',
        ip_address: clientIp,
      });

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if MFA is enabled
    if (user.mfa_enabled) {
      // Create temporary session
      const tempToken = await generateJWT(user.id, user.email, user.role);
      
      return NextResponse.json(
        {
          mfa_required: true,
          temp_token: tempToken,
          user_id: user.id,
        },
        { status: 202 }
      );
    }

    // Generate JWT token
    const token = await generateJWT(user.id, user.email, user.role);

    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Log successful login
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'LOGIN_SUCCESS',
      resource_type: 'user',
      ip_address: clientIp,
    });

    // Remove sensitive data
    const { password_hash, mfa_secret, ...safeUser } = user;

    return NextResponse.json(
      {
        success: true,
        user: safeUser,
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
