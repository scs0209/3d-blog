const fs = require('fs');
const path = require('path');
const semver = require('semver');

// 입력 인자 확인
const bumpType = process.argv[2] || 'patch';
const validTypes = ['patch', 'minor', 'major'];

if (!validTypes.includes(bumpType)) {
  console.error(`❌ 잘못된 버전 타입: ${bumpType}`);
  process.exit(1);
}

const packagePath = path.resolve(__dirname, '../package.json');
const changelogPath = path.resolve(__dirname, '../CHANGELOG.md');

// 현재 버전 가져오기
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
const currentVersion = pkg.version;

// 새로운 버전 계산
const newVersion = semver.inc(currentVersion, bumpType);
if (!newVersion) {
  console.error(`❌ semver 버전 증가 실패`);
  process.exit(1);
}

// package.json 업데이트
pkg.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));

// changelog 업데이트
const today = new Date().toISOString().split('T')[0];
const changelogEntry = `## ${newVersion} (${today})\n\n- 변경 사항을 작성하세요\n\n`;

const existingChangelog = fs.existsSync(changelogPath) ? fs.readFileSync(changelogPath, 'utf-8') : '';

fs.writeFileSync(changelogPath, changelogEntry + existingChangelog);

console.log(`✅ 버전 ${currentVersion} → ${newVersion} 로 업데이트됨`);
