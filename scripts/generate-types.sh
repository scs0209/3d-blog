#!/bin/bash
# scripts/generate-types.sh
set -euo pipefail

ENV_FILE="$(pwd)/.env"
if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC1090
  source "$ENV_FILE"
else
  echo "Error: .env file not found in project root"
  exit 1
fi

if [ -z "${API_DOCS_URL:-}" ]; then
  echo "Error: API_DOCS_URL is not set in .env"
  exit 1
fi

OUT_FILE="src/shared/api/openapi-types.ts"

# TypeScript 7 + openapi-typescript(현재) 조합이 깨져서,
# 생성 시에는 typescript@5.8을 같이 올려 실행한다.
pnpm dlx --package typescript@5.8.3 --package openapi-typescript@7.8.0 \
  openapi-typescript "$API_DOCS_URL" -o "$OUT_FILE"

echo "Generated $OUT_FILE from $API_DOCS_URL"
