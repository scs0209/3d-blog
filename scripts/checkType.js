const fs = require('fs');
const path = require('path');

// Typedoc 데이터 로드 함수
function loadTypedocData(typedocFilePath) {
  try {
    const data = fs.readFileSync(typedocFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Unable to read or parse Typedoc JSON file: ${error.message}`,
      );
    } else {
      throw new Error(
        'An unknown error occurred while reading the Typedoc JSON file.',
      );
    }
  }
}

// Typedoc에 정의된 타입 이름 목록 추출 함수
function getExistingTypes(typedocData) {
  const types = new Set();
  if (typedocData.children) {
    typedocData.children.forEach((child) => {
      if (child.kind === 2097152) {
        types.add(child.name);
      }
    });
  }
  console.log(types);
  return types;
}

// 새 타입 이름 확인 함수
function checkTypeName(typeName, existingTypes) {
  if (existingTypes.has(typeName)) {
    console.error(
      `\x1b[31m[ERROR]\x1b[0m Type "${typeName}" is already defined in Typedoc.`,
    );
    process.exit(1);
  } else {
    console.log(
      `\x1b[32m[PASS]\x1b[0m Type "${typeName}" is not defined. You can proceed.`,
    );
  }
}

// 스크립트 실행
function main() {
  const typedocFilePath = path.join(__dirname, '../docs/typedoc.json');
  const typeName = process.argv[2];

  if (!typeName) {
    console.error(
      '\x1b[31m[ERROR]\x1b[0m Please provide a type name as an argument.',
    );
    process.exit(1);
  }

  try {
    const typedocData = loadTypedocData(typedocFilePath);
    const existingTypes = getExistingTypes(typedocData);
    checkTypeName(typeName, existingTypes);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`\x1b[31m[ERROR]\x1b[0m ${error.message}`);
    } else {
      console.error(
        '\x1b[31m[ERROR]\x1b[0m An unknown error occurred during execution.',
      );
    }
    process.exit(1);
  }
}

main();
