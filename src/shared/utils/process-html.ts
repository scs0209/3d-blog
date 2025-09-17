// HTML 문자열에서 코드블럭 내부의 \n 개행 문자를 <br> 태그로 변환
export const preprocessHTML = (html: string) => {
  return html.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/g, (match, content) => {
    // 코드블럭 내부의 \n 개행 문자를 <br> 태그로 변환
    const processedContent = content.replace(/\n/g, '<br>');
    return match.replace(content, processedContent);
  });
};