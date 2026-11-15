/**
 * 페이지 전환 틀. 예전에는 색 띠가 화면을 쓸고 지나가는 오버레이가 있었지만,
 * 화면마다 자체 진입 연출(칩 안으로 들어가기, 카드가 솟아오르기)이 있어 겹치지 않도록 뺐다.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return children;
}
