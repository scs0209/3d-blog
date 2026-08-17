import { type NextRequest, NextResponse } from 'next/server';
import { getBaseUrl } from '@/shared/lib/get-base-url';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
/** 개별 free 모델은 자주 deprecated 되므로 auto-router 사용 */
const SUMMARY_MODEL = process.env.OPENROUTER_SUMMARY_MODEL || 'openrouter/free';

const stripHtml = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * @swagger
 * /api/summarize:
 *   post:
 *     summary: 블로그 포스트 요약 생성
 *     description: AI를 사용하여 블로그 포스트의 내용을 간결하게 요약합니다
 *     tags:
 *       - AI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - title
 *             properties:
 *               content:
 *                 type: string
 *                 description: 요약할 블로그 포스트 내용
 *                 example: "이 글에서는 React와 Next.js를 사용한 웹 개발에 대해 다룹니다..."
 *               title:
 *                 type: string
 *                 description: 블로그 포스트 제목
 *                 example: "React와 Next.js로 현대적인 웹 애플리케이션 구축하기"
 *     responses:
 *       200:
 *         description: 요약 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: string
 *                   description: 생성된 요약 텍스트
 *                   example: "React와 Next.js를 활용한 웹 개발 방법론과 실제 구현 과정을 다룬 글입니다."
 *       400:
 *         description: 필수 필드 누락 또는 본문이 너무 짧음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "콘텐츠와 제목이 필요합니다."
 *       500:
 *         description: 서버 설정 오류 또는 예외
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "요약 생성에 실패했습니다."
 *       502:
 *         description: OpenRouter 호출 실패 또는 빈 요약
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "요약 생성에 실패했습니다."
 */
export async function POST(request: NextRequest) {
  try {
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'AI 요약 설정이 없습니다.' }, { status: 500 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: '잘못된 요청 본문입니다.' }, { status: 400 });
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: '잘못된 요청 본문입니다.' }, { status: 400 });
    }

    const { content, title } = body as Record<string, unknown>;

    if (typeof content !== 'string' || typeof title !== 'string') {
      return NextResponse.json({ error: '콘텐츠와 제목은 문자열이어야 합니다.' }, { status: 400 });
    }

    if (!content.trim() || !title.trim()) {
      return NextResponse.json({ error: '콘텐츠와 제목이 필요합니다.' }, { status: 400 });
    }

    const plainText = stripHtml(content);
    if (plainText.length < 20) {
      return NextResponse.json({ error: '요약할 본문이 너무 짧습니다.' }, { status: 400 });
    }

    const truncatedContent = plainText.length > 4000 ? `${plainText.slice(0, 4000)}...` : plainText;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': getBaseUrl(),
        'X-Title': '3d-blog',
      },
      body: JSON.stringify({
        model: SUMMARY_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes blog posts in Korean.',
          },
          {
            role: 'user',
            content: `다음 블로그 포스트를 간결하고 명확하게 요약해주세요. 자연스러운 문단으로 작성해주세요:
- 제목이나 헤더는 사용하지 마세요
- 핵심 내용을 2-3문장으로 요약해주세요
- 코드나 기술 용어만 \`코드\` 형식으로 표시해주세요
- 각 문단은 빈 줄로 구분해주세요

제목: ${title.trim()}
내용: ${truncatedContent}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('OpenRouter 요약 실패:', response.status, errorBody.slice(0, 500));
      return NextResponse.json({ error: '요약 생성에 실패했습니다.' }, { status: 502 });
    }

    const data = await response.json();
    const summary = data?.choices?.[0]?.message?.content?.trim();

    if (!summary) {
      return NextResponse.json({ error: '요약을 생성할 수 없습니다.' }, { status: 502 });
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('AI 요약 생성 실패:', error);
    return NextResponse.json({ error: '요약 생성에 실패했습니다.' }, { status: 500 });
  }
}
