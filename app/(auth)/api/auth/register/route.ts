import { NextRequest, NextResponse } from 'next/server';
import { register } from '../../../actions';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const result = await register({ status: 'idle' }, formData);
  return NextResponse.json(result);
} 