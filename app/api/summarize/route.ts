import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { content, title } = await request.json();
    console.log('요약 요청:', title);

    if (!content || !title) {
      return NextResponse.json(
        { error: '콘텐츠와 제목이 필요합니다.' },
        { status: 400 }
      );
    }

    // 콘텐츠가 너무 길면 앞부분만 사용 (토큰 제한 고려)
    const truncatedContent = content.length > 3000 ? `${content.substring(0, 3000)}...` : content;
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": 'deepseek/deepseek-chat-v3-0324:free',
        "messages": [
          {
            role: 'user',
            content: `다음 블로그 포스트를 간결하고 명확하게 요약해주세요. 핵심 내용을 2-3문장으로 요약해주세요. 블로그 포스트는 다음과 같습니다. 제목: ${title} 내용: ${truncatedContent}`
          }
        ],
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API 오류: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.choices[0].message.content);
    const summary = data.choices[0].message.content || '요약을 생성할 수 없습니다.';

    console.log('요약 완료:', summary);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('AI 요약 생성 실패:', error);
    return NextResponse.json(
      { error: '요약 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 