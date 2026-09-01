import { describe, expect, test } from 'vitest';
import { shouldPersistQuery } from '../query-persist';

const success = { status: 'success' };
const pending = { status: 'pending' };

describe('shouldPersistQuery', () => {
  test('사이드바·카테고리·태그·글 목록만 영속화한다', () => {
    expect(shouldPersistQuery({ queryKey: ['sidebar'], state: success })).toBe(true);
    expect(shouldPersistQuery({ queryKey: ['category', 'all'], state: success })).toBe(true);
    expect(shouldPersistQuery({ queryKey: ['tag', 'all'], state: success })).toBe(true);
    expect(shouldPersistQuery({ queryKey: ['post', 'all', { page: 1 }], state: success })).toBe(true);
  });

  test('좋아요·댓글·유저·AI 요약은 영속화하지 않는다', () => {
    expect(shouldPersistQuery({ queryKey: ['like', 'list', 1], state: success })).toBe(false);
    expect(shouldPersistQuery({ queryKey: ['comment', 'list', 1], state: success })).toBe(false);
    expect(shouldPersistQuery({ queryKey: ['user', 'all'], state: success })).toBe(false);
    expect(shouldPersistQuery({ queryKey: ['post', 'summary', '1', ''], state: success })).toBe(false);
    expect(shouldPersistQuery({ queryKey: ['visitor', 'today'], state: success })).toBe(false);
  });

  test('성공하지 않은 쿼리는 영속화하지 않는다', () => {
    expect(shouldPersistQuery({ queryKey: ['sidebar'], state: pending })).toBe(false);
  });
});
