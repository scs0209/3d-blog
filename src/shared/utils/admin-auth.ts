import type { Session } from 'next-auth';

/**
 * Admin 권한 체크
 *
 * @param user 체크할 사용자 객체
 * @returns 관리자 권한이 있으면 `true`, 없으면 `false`
 */
export function isAdmin(user: Session['user'] | null): user is Session['user'] & { role: 'ADMIN' } {
  return user?.role === 'ADMIN';
}
