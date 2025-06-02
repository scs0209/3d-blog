export function createSlug(title: string) {
  return title
    .trim()
    .replace(/[A-Z]/g, (ch) => ch.toLowerCase()) // 영어만 소문자
    .replace(/[^a-z0-9가-힣\s-]/gi, '') // 영어, 숫자, 한글, 공백, -만 허용
    .replace(/\s+/g, '-') // 공백을 -로
    .replace(/-+/g, '-') // 연속된 - 하나로
    .replace(/^-+|-+$/g, ''); // 양끝 - 제거
}
