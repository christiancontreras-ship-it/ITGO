import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hashPassword, isValidEmail, isStrongPassword, checkRateLimit, generateJWT } from '@/lib/auth';

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
    const { email, password, full_name, role = 'client' } = body;

    // Validation
    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const passwordValidation = isStrongPassword(password);
    if (!passwordValidation.isStrong) {
      return NextResponse.json(
        { error: 'Password does not meet requirements', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    if (full_name.length < 2 || full_name.length > 255) {
      return NextResponse.json(
        { error: 'Full name must be between 2 and 255 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = hashPassword(password);

    // Create user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        full_name,
        password_hash: passwordHash,
        role,
        is_active: true,
        is_verified: false,
      })
      .select()
      .single();

    if (insertError || !newUser) {
      console.error('Error creating user:', insertError);
      return NextResponse.json(
        { error: 'Error creating user account' },
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = await generateJWT(newUser.id, newUser.email, newUser.role);

    // Log registration
    await supabase.from('audit_logs').insert({
      user_id: newUser.id,
      action: 'REGISTRATION',
      resource_type: 'user',
      ip_address: clientIp,
    });

    // Send verification email (in production)
    // await sendVerificationEmail(email, newUser.id);

    // Remove sensitive data
    const { password_hash, mfa_secret, ...safeUser } = newUser;

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your email.',
        user: safeUser,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
