import requests
import sys
import os

def review_code(code: str) -> str:
    # Ollama API 엔드포인트 (로컬에서 ollama 실행 중이어야 함)
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": "qwen2.5-coder:latest",  # 사용할 모델명 (예: mistral, llama2 등)
        "prompt": f"다음 코드를 리뷰해줘:\n{code}",
        "stream": False
    }
    response = requests.post(url, json=payload)
    return response.json().get("response", "")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        # 인자가 없으면 테스트용 코드로 리뷰
        code = """
def add(a, b):
    return a + b

print(add(2, 3))
"""
        print("[테스트용 코드로 리뷰를 진행합니다]")
    else:
        file_path = sys.argv[1]
        if not os.path.exists(file_path):
            print(f"{file_path} 파일이 존재하지 않습니다.")
            sys.exit(1)
        with open(file_path, "r", encoding="utf-8") as f:
            code = f.read()
    review = review_code(code)
    print(review)