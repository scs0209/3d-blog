/** URL path segment을 최대 3회 decode (이중 인코딩 대응) */
export const decodePathSegment = (value: string) => {
  let decoded = value;
  for (let i = 0; i < 3; i++) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }
  return decoded;
};
