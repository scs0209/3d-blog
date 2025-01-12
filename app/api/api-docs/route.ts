import { NextResponse } from 'next/server';
import { getApiDocs } from '@/shared/lib/swagger';

export async function GET() {
  const spec = await getApiDocs(); // Swagger 명세 생성
  return NextResponse.json(spec); // JSON 응답으로 반환
}
