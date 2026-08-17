// HTML 문자열에서 코드블럭 내부의 \n 개행 문자를 <br> 태그로 변환
// mermaid 등 줄바꿈이 문법인 블록은 제외
export const preprocessHTML = (html: string) => {
  return html.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/g, (match, content) => {
    if (/language-mermaid|class="[^"]*mermaid/i.test(match)) {
      return match;
    }

    const processedContent = content.replace(/\n/g, '<br>');
    return match.replace(content, processedContent);
  });
};

/** code 블록 텍스트 추출 (preprocessHTML의 <br> 변환 후에도 mermaid 소스 복원) */
export const getCodeBlockText = (codeElement: Element) => {
  const html = codeElement.innerHTML.replace(/<br\s*\/?>/gi, '\n');
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value.trim();
};
