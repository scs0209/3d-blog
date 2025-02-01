export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 특수문자 제거
    .replace(/[\s_-]+/g, '-') // 공백이나 언더스코어를 대시로 변환
    .replace(/^-+|-+$/g, ''); // 시작과 끝의 대시 제거
}
