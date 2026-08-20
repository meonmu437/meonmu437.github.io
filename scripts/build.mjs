import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = `${root}dist`;

// 빌드 없이 그대로 복사하는 정적 사이트. landing만 대문(루트)으로 바로
// 병합되고, 나머지는 자기 이름의 하위 폴더로 복사된다.
const staticApps = ['landing'];
const staticSubApps = ['jamdam'];

// 자체 빌드 스텝이 있는 세계관(Astro 등). 새 세계관을 추가할 때는
// apps/ 아래 폴더를 만들고 여기 한 줄만 추가하면 된다.
const buildApps = [
	{ dir: 'colorground', outPath: 'colorground' },
	{ dir: 'nighthighway', outPath: 'nighthighway' },
	{ dir: 'anemoi', outPath: 'anemoi' },
	{ dir: 'yunhaesi', outPath: 'yunhaesi' },
	{ dir: 'seungmin', outPath: 'seungmin' },
	{ dir: '1997', outPath: '1997' },
	{ dir: 'hanminwoo', outPath: 'hanminwoo' },
];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const name of staticApps) {
	cpSync(`${root}apps/${name}`, dist, { recursive: true });
}

for (const name of staticSubApps) {
	cpSync(`${root}apps/${name}`, `${dist}/${name}`, { recursive: true });
}

for (const { dir, outPath } of buildApps) {
	const appDir = `${root}apps/${dir}`;
	execSync('npm ci', { cwd: appDir, stdio: 'inherit' });
	execSync('npm run build', { cwd: appDir, stdio: 'inherit' });
	cpSync(`${appDir}/dist`, `${dist}/${outPath}`, { recursive: true });
}

console.log(`빌드 완료 -> ${dist}`);
