import { describe, expect, test } from 'vitest';
import { sanitizePostHtml } from '../sanitize-html';

describe('sanitizePostHtml', () => {
  test('허용된 Tiptap 태그는 유지한다', () => {
    const html = '<h2>제목</h2><p>본문 <strong>강조</strong>와 <a href="https://example.com">링크</a></p>';
    expect(sanitizePostHtml(html)).toContain('<h2>제목</h2>');
    expect(sanitizePostHtml(html)).toContain('<strong>강조</strong>');
    expect(sanitizePostHtml(html)).toContain('href="https://example.com"');
  });

  test('script와 event handler를 제거한다', () => {
    const html = '<p onclick="alert(1)">ok</p><script>alert(2)</script><img src="x" onerror="alert(3)">';
    const sanitized = sanitizePostHtml(html);
    expect(sanitized).not.toMatch(/script/i);
    expect(sanitized).not.toMatch(/onclick/i);
    expect(sanitized).not.toMatch(/onerror/i);
    expect(sanitized).toContain('ok');
  });

  test('javascript: URL을 제거한다', () => {
    const html = '<a href="javascript:alert(1)">click</a>';
    const sanitized = sanitizePostHtml(html);
    expect(sanitized.toLowerCase()).not.toContain('javascript:');
  });

  test('YouTube iframe만 허용한다', () => {
    const allowed = sanitizePostHtml(
      '<iframe src="https://www.youtube.com/embed/abc123" allowfullscreen></iframe>',
    );
    expect(allowed).toContain('youtube.com/embed/abc123');

    const blocked = sanitizePostHtml('<iframe src="https://evil.example/embed"></iframe>');
    expect(blocked).not.toContain('evil.example');
  });
});
