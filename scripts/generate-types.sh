#!/bin/bash
# scripts/generate-types.sh

ENV_FILE="$(pwd)/.env"
if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
else
    echo "Error: .env file not found in project root"
    exit 1
fi

openapi-typescript "$API_DOCS_URL" -o src/shared/api/generated/index.ts