import requests

def review_code(code: str) -> str:
    # Ollama API 엔드포인트 (로컬에서 ollama 실행 중이어야 함)
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": "mistral",  # 사용할 모델명 (예: mistral, llama2 등)
        "prompt": f"다음 코드를 리뷰해줘:\n{code}",
        "stream": False
    }
    response = requests.post(url, json=payload)
    return response.json().get("response", "")

if __name__ == "__main__":
    # 예시: 리뷰할 파일 경로를 지정
    with open("app/example.py", "r", encoding="utf-8") as f:
        code = f.read()
    review = review_code(code)
    print(review)