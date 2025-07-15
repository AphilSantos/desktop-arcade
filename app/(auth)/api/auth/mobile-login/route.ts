import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { compare } from 'bcrypt-ts';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ status: 'error', message: 'Missing credentials' }, {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    const users = await getUser(email);
    if (users.length === 0) {
      return NextResponse.json({ status: 'error', message: 'Invalid credentials' }, {
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    const passwordsMatch = await compare(password, users[0].password!);
    if (!passwordsMatch) {
      return NextResponse.json({ status: 'error', message: 'Invalid credentials' }, {
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    return NextResponse.json({
      status: 'success',
      user: {
        id: users[0].id,
        email: users[0].email,
        preferredName: users[0].preferredName,
      },
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e) {
    return NextResponse.json({ status: 'error', message: 'Server error' }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
} 