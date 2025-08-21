import { type NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

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
 *         description: 필수 필드 누락
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "콘텐츠와 제목이 필요합니다."
 *       500:
 *         description: 서버 오류 또는 AI 요약 생성 실패
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
    const { content, title } = await request.json();

    if (!content || !title) {
      return NextResponse.json({ error: '콘텐츠와 제목이 필요합니다.' }, { status: 400 });
    }

    // 콘텐츠가 너무 길면 앞부분만 사용 (토큰 제한 고려)
    const truncatedContent = content.length > 3000 ? `${content.substring(0, 3000)}...` : content;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes blog posts.',
          },
          {
            role: 'user',
            content: `다음 블로그 포스트를 간결하고 명확하게 요약해주세요. 자연스러운 문단으로 작성해주세요:
- 제목이나 헤더는 사용하지 마세요
- 핵심 내용을 2-3문장으로 요약해주세요
- 코드나 기술 용어만 \`코드\` 형식으로 표시해주세요
- 각 문단은 빈 줄로 구분해주세요

블로그 포스트는 다음과 같습니다. 제목: ${title} 내용: ${truncatedContent}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API 오류: ${response.status}`);
    }

    const data = await response.json();
    const summary = data.choices[0].message.content || '요약을 생성할 수 없습니다.';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('AI 요약 생성 실패:', error);
    return NextResponse.json({ error: '요약 생성에 실패했습니다.' }, { status: 500 });
  }
}
