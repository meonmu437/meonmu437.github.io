import { createHash } from 'node:crypto';
import worldBible from '../data/world-bible.js';

const MIN_AGE = 20;
const MAX_RETRIES = 1;

const CHARACTER_SCHEMA = {
	type: 'OBJECT',
	properties: {
		name: { type: 'STRING' },
		age: { type: 'INTEGER' },
		gender: { type: 'STRING' },
		nationality: { type: 'STRING' },
		occupation: { type: 'STRING' },
		callsign: { type: 'STRING' },
		appearance: { type: 'STRING' },
		clothing: { type: 'STRING' },
		personality: { type: 'STRING' },
		likes: { type: 'ARRAY', items: { type: 'STRING' } },
		dislikes: { type: 'ARRAY', items: { type: 'STRING' } },
		habits: { type: 'STRING' },
		bike: { type: 'STRING' },
		background: { type: 'STRING' },
		relationshipStory: { type: 'STRING' },
	},
	required: [
		'name',
		'age',
		'gender',
		'nationality',
		'occupation',
		'appearance',
		'clothing',
		'personality',
		'likes',
		'dislikes',
		'habits',
		'background',
	],
};

function resolveAllowedOrigin(requestOrigin) {
	const primary = process.env.ALLOWED_ORIGIN || '';
	if (requestOrigin && requestOrigin === primary) return primary;
	// 로컬 개발 서버(포트는 실행 상황에 따라 달라짐)에서도 테스트할 수 있게 허용한다.
	if (requestOrigin && /^http:\/\/localhost:\d+$/.test(requestOrigin)) return requestOrigin;
	return primary;
}

function setCorsHeaders(req, res) {
	res.setHeader('Access-Control-Allow-Origin', resolveAllowedOrigin(req.headers.origin));
	res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Vary', 'Origin');
}

function hashIp(ip, salt) {
	return createHash('sha256').update(salt + ip).digest('hex');
}

function todayUtc() {
	return new Date().toISOString().slice(0, 10);
}

function sanitizeText(value, maxLength) {
	if (typeof value !== 'string') return '';
	return value.trim().slice(0, maxLength);
}

// "정거장 내 일반 주민" 요청을 구체화할 때 모델이 매번 비슷한 직업(특히
// 정비 관련)으로 쏠리는 걸 막기 위해, 서버에서 무작위로 하나를 골라
// 프롬프트에 앵커로 찔러준다.
const CIVILIAN_JOB_EXAMPLES = [
	'배급소 점원',
	'식료품점 상인',
	'세탁소 운영자',
	'정거장 경비원',
	'폐기물 분류공',
	'온실 재배사',
	'보육 도우미',
	'술집 종업원',
	'이발사',
	'재봉사',
	'기록 보관인',
	'조리사',
	'약사',
	'우편 분류원',
	'행상인',
];

function buildPrompt(input) {
	const existingNamesList = worldBible.existingCharacters
		.map((c) => `- ${c.name} (콜사인: ${c.callsign}${c.bike ? `, 바이크: ${c.bike}` : ''}) — ${c.note}`)
		.join('\n');

	const sampleStationsList = worldBible.sampleStations
		.map((s) => `- ${s.sid} — ${s.city} ("${s.nick}", ${s.mood} 분위기)`)
		.join('\n');

	const civilianJobAnchor = CIVILIAN_JOB_EXAMPLES[Math.floor(Math.random() * CIVILIAN_JOB_EXAMPLES.length)];

	const userLines = [
		`- 이름 요청: ${input.name || '(지정 없음 — 자유롭게 정할 것)'}`,
		`- 성별: ${input.gender || '(지정 없음 — 자유롭게 정할 것)'}`,
		`- 나이: ${input.age ? `${input.age}세로 고정` : `${MIN_AGE}세 이상 중 자유롭게 정할 것`}`,
		`- 국적: ${input.nationality || '(지정 없음 — 자유롭게 정할 것)'}`,
		`- 직업: ${input.occupation || '(지정 없음 — 세계관에 맞는 직업을 자유롭게 정할 것)'}`,
		`- 성격 키워드: ${input.personality || '(지정 없음 — 세계관에 맞는 성격을 자유롭게 정할 것)'}`,
		`- 외모 요청: ${input.appearance || '(지정 없음 — 자유롭게 정할 것)'}`,
		`- 관계 요청: ${input.relationship || '(없음 — 관계 서사를 만들지 말 것)'}`,
		`- 추가 특징/요청: ${input.feature || '(없음)'}`,
	].join('\n');

	const riderLore = worldBible.relationshipLore?.[input.riderId];
	const riderLoreBlock = riderLore
		? `\n## 관계 상대의 비하인드 설정 (참고용 — 그대로 재서술하지 말고 관계 서사의 배경으로 자연스럽게 녹여서 활용할 것. 이 사건 이후의 전개는 아직 벌어지지 않은 것으로 간주하고 서술하지 말 것 — 그 뒤는 플레이어가 직접 진행할 부분입니다.)\n${riderLore}\n`
		: '';

	return `당신은 "NIGHT HIGHWAY"라는 세계관의 플레이 캐릭터 프로필을 만드는 작가입니다.

# 세계관 설정
${worldBible.setting}

## 세계관 사실
${worldBible.worldFacts.map((f) => `- ${f}`).join('\n')}

## 반드시 지킬 것 (세계관 톤/기술 수준)
${worldBible.toneGuardrails.map((g) => `- ${g}`).join('\n')}

## 이미 존재하는 주요 캐릭터 (이름·설정·바이크 이름을 절대 겹치지 말 것)
${existingNamesList}

## 실제 존재하는 정거장 예시 (전체 목록 중 일부 — 배경 서사에서 정거장을 언급할 때 참고할 것)
${sampleStationsList}
위 목록 중 하나를 그대로 써도 되고, 같은 SID 형식(대문자+숫자 3자리-3자리)으로 새 정거장을 지어내도 됩니다. 'SID-409'처럼 형식을 어긴 코드는 절대 쓰지 마세요.
${riderLoreBlock}
# 사용자가 요청한 조건
${userLines}

# 중요: 이 캐릭터는 누구인가
이 캐릭터는 플레이어가 NIGHT HIGHWAY 세계관 "안에서 직접 연기할 자신의 캐릭터(페르소나)"입니다. 플레이어 본인과 상호작용하는 대상이 아니라, 플레이어가 되어 세계와 그 안의 NPC(노에, 카미유 등)와 상호작용할 주체입니다. 따라서 모든 서술은 3인칭으로, 이 캐릭터를 중심에 두고 써야 하며 "당신"처럼 플레이어를 직접 지칭하는 표현은 쓰지 마세요.

# 캐릭터 생성 규칙
1. 이름과 설정(직업, 배경, 콜사인, 바이크 이름 등)은 위에 나열된 기존 캐릭터와 겹치지 않아야 합니다. name 필드는 반드시 "한국어 이름 (영문 이름)" 형식으로 작성하세요 (예: "베라 린드 (Vera Lind)"). 이름 요청이 있다면 최대한 그대로 반영해서 이 형식에 맞게 표기하고, 요청이 없다면 자유롭게 지어내세요.
2. 나이는 반드시 ${MIN_AGE}세 이상인 성인이어야 합니다.
3. 세계관 기술 수준(아날로그/반아날로그 장비, 정거장 단위 생활, 상시 디지털 연결 없음)을 벗어나는 설정을 넣지 마세요.
4. 사용자가 지정한 성격 키워드가 있다면, 그 키워드를 단순히 나열하지 말고 personality 서술이나 background 속 구체적인 행동으로 드러나야 합니다.
5. 관계 요청이 있는 경우에만 relationshipStory를 작성하세요. 이 캐릭터와 관계 요청 대상(특정 라이더) 사이의 배경 서사이며, 사건을 나열하지 말고 관계가 어떻게 시작되었거나 지금 어떤 상태인지 하나의 구체적인 장면·사건으로 보여주세요. 플레이어를 향한 떡밥이 아니라, 이 캐릭터의 과거 서사로 취급하세요. 관계 요청이 없다면 relationshipStory는 빈 문자열("")로 두고, 절대로 기존 캐릭터(노에, 카미유 등)를 임의로 끌어와 관계를 지어내지 마세요 — background만으로 충분한 페르소나 소개가 되어야 합니다.
6. 모든 텍스트는 한국어로 작성하세요. 존댓말(-습니다, -해요体)을 쓰지 말고, 짧고 간결한 설명문(평서문, ~다체)으로 작성하세요 — 대화체가 아니라 프로필 문서처럼 읽혀야 합니다.
7. 각 항목은 짧고 뻔한 요약이 아니라, 구체적이고 풍부한 디테일을 담아 작성하세요. 구체적인 기준은 다음과 같습니다.
   - appearance: 키, 체형, 헤어스타일과 색, 눈동자 색과 인상, 피부, 흉터나 문신 등 신체적 특징을 최소 3가지 이상 구체적으로 묘사하세요.
   - clothing: 이 세계관(아날로그 생존 환경)에 맞는 구체적인 복장·장비를 묘사하세요 (재질, 색, 낡거나 개조된 디테일 포함).
   - personality: 키워드로 나열하지 말고, 2~3문장의 자연어 서술로 풀어서 표현하세요.
   - likes / dislikes: 각각 구체적인 항목 3~4가지를 배열로 제시하세요 (추상적 표현 대신 구체적 사물·상황).
   - habits: 대화나 긴장 상황에서 드러나는 구체적인 몸짓이나 말버릇 등 습관을 1~2가지 묘사하세요.
   - background: 최소 3문장 이상으로, 세계관 안에서의 구체적인 사건과 이력을 담아 작성하세요.
8. 직업이 라이더이거나 라이더 활동을 겸하는 경우에만:
   - bike 필드에 바이크 이름과 짧은 특징을 채우세요.
   - callsign 필드에 세계관의 동물 콜사인 문화에 맞는 콜사인을 "영어 콜사인 (한국어 동물명)" 형식으로 채우세요 (예: "RAVEN (까마귀)"). callsign은 bike 이름과 반드시 달라야 하며, 기존 캐릭터의 콜사인과도 겹치면 안 됩니다.
   라이더가 아니라면 bike와 callsign 모두 빈 문자열("")로 두세요.
9. gender 필드에는 실제로 정한 성별을 한 단어로 명시하세요 (사용자가 지정하지 않았다면 자유롭게 정한 성별을 그대로 적으세요).
10. nationality 필드에는 실제로 정한 국적을 명시하세요 (사용자가 지정하지 않았다면 세계관에 어울리는 국적을 자유롭게 정하세요).
11. 직업 요청이 "정거장 내 일반 주민"처럼 포괄적인 경우, occupation 필드를 반드시 "${civilianJobAnchor}"를 기반으로 채우세요 (그 단어를 그대로 쓰거나, 같은 종류의 일이라는 걸 알 수 있게 살짝 구체화만 하세요 — 예: 이름이나 소속 정거장을 붙이는 정도). 라이더 / 지도 제작자 / 정비공 / 정거장 진료소 의사 / 무전 중계사, 그리고 온실·식물재배 관련 직업으로는 절대 바꾸지 마세요.

지정된 JSON 스키마에 맞춰 캐릭터 프로필 하나만 응답하세요.`;
}

class UpstreamOverloadedError extends Error {}
class QuotaExhaustedError extends Error {}

async function callGemini(prompt) {
	const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';
	const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			contents: [{ parts: [{ text: prompt }] }],
			generationConfig: {
				responseMimeType: 'application/json',
				responseSchema: CHARACTER_SCHEMA,
				temperature: 1,
			},
		}),
	});

	if (!res.ok) {
		const errText = await res.text();
		// Gemini 무료 티어는 여러 방문자가 같은 키를 공유해서 쓰기 때문에, 개인
		// 하루 한도와 무관하게 이 상태를 받을 수 있다. 원본 에러 텍스트는 노출하지
		// 않고, 실제 원인에 맞는 안내로 나눠서 보여준다:
		//   - RESOURCE_EXHAUSTED: 이 앱이 쓰는 Gemini 키의 "오늘치" 요청 한도 자체가
		//     다 소진됨 (지금 기다려도 소용없고 내일 리셋돼야 함).
		//   - UNAVAILABLE(503) 등: 일시적인 과부하 (잠시 후 재시도하면 될 가능성 큼).
		let errStatus = '';
		try {
			errStatus = JSON.parse(errText)?.error?.status || '';
		} catch {
			// 에러 본문이 JSON이 아니면 상태 코드만으로 판단한다.
		}

		if (errStatus === 'RESOURCE_EXHAUSTED') {
			throw new QuotaExhaustedError(`Gemini API quota exhausted (${res.status})`);
		}
		if (res.status === 429 || res.status === 503) {
			throw new UpstreamOverloadedError(`Gemini API upstream busy (${res.status})`);
		}
		throw new Error(`Gemini API error ${res.status}: ${errText.slice(0, 300)}`);
	}

	const data = await res.json();
	const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
	if (!text) throw new Error('Gemini response missing text');
	return JSON.parse(text);
}

// bike/callsign 필드는 "영어 이름 (한국어 설명)" 형식이라, 앞의 영어 토큰만
// 뽑아서 비교해야 정확히 겹치는지 판단할 수 있다.
function leadingToken(value) {
	return (value || '').trim().split(/[\s(]/)[0].toLowerCase();
}

function collidesWithExisting(character) {
	const name = (character.name || '').toLowerCase();
	const bikeToken = leadingToken(character.bike);
	const callsignToken = leadingToken(character.callsign);
	return worldBible.existingCharacters.some((c) => {
		const existingName = c.name.toLowerCase();
		const nameCollision = existingName.includes(name) || name.includes(existingName.split(' ')[0]);
		const bikeCollision = !!c.bike && !!bikeToken && leadingToken(c.bike) === bikeToken;
		const callsignCollision =
			!!c.callsign &&
			!!callsignToken &&
			c.callsign
				.toLowerCase()
				.split('/')
				.map((s) => s.trim())
				.includes(callsignToken);
		return nameCollision || bikeCollision || callsignCollision;
	});
}

async function generateCharacter(input) {
	let prompt = buildPrompt(input);
	let lastCharacter = null;

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
		const character = await callGemini(prompt);
		lastCharacter = character;

		const nameCollision = collidesWithExisting(character);
		const invalidAge = !Number.isInteger(character.age) || character.age < MIN_AGE;

		if (!nameCollision && !invalidAge) {
			return character;
		}

		prompt += `\n\n(이전 시도가 규칙을 어겼습니다: ${nameCollision ? '이름이 기존 캐릭터와 겹칩니다.' : ''}${
			invalidAge ? ` 나이가 ${MIN_AGE}세 이상이어야 합니다.` : ''
		} 다른 결과를 만들어주세요.)`;
	}

	return lastCharacter;
}

async function upstash(command) {
	const base = process.env.UPSTASH_REDIS_REST_URL;
	const token = process.env.UPSTASH_REDIS_REST_TOKEN;
	const res = await fetch(`${base}/${command.map(encodeURIComponent).join('/')}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) throw new Error(`Upstash error ${res.status}`);
	const data = await res.json();
	return data.result;
}

export default async function handler(req, res) {
	setCorsHeaders(req, res);

	if (req.method === 'OPTIONS') {
		res.status(204).end();
		return;
	}

	if (req.method !== 'POST') {
		res.status(405).json({ ok: false, error: 'method_not_allowed' });
		return;
	}

	const body = req.body || {};
	const isBypassed = !!process.env.ADMIN_BYPASS_TOKEN && body.adminToken === process.env.ADMIN_BYPASS_TOKEN;

	const input = {
		name: sanitizeText(body.name, 40),
		gender: sanitizeText(body.gender, 20),
		nationality: sanitizeText(body.nationality, 40),
		occupation: sanitizeText(body.occupation, 40),
		personality: sanitizeText(body.personality, 100),
		appearance: sanitizeText(body.appearance, 200),
		relationship: sanitizeText(body.relationship, 200),
		riderId: sanitizeText(body.riderId, 20),
		feature: sanitizeText(body.feature, 300),
		age: null,
	};

	if (body.age !== undefined && body.age !== null && body.age !== '') {
		const age = Number(body.age);
		if (!Number.isInteger(age) || age < MIN_AGE || age > 99) {
			res.status(400).json({ ok: false, error: 'invalid_age', message: `나이는 ${MIN_AGE}세 이상 정수여야 합니다.` });
			return;
		}
		input.age = age;
	}

	const dailyLimit = Number(process.env.DAILY_LIMIT || '5');
	let newCount = 0;

	if (!isBypassed) {
		const forwardedFor = req.headers['x-forwarded-for'];
		const ip = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor || '').split(',')[0].trim() || 'unknown';
		const ipHash = hashIp(ip, process.env.RATE_LIMIT_SALT || '');
		const rateLimitKey = `rl:${ipHash}:${todayUtc()}`;

		try {
			// INCR은 원자적이라 동시에 들어온 요청끼리 카운트가 씹히지 않는다.
			// 새로 생긴 키(값이 1)일 때만 하루짜리 만료를 걸어준다.
			newCount = Number(await upstash(['INCR', rateLimitKey]));
			if (newCount === 1) {
				await upstash(['EXPIRE', rateLimitKey, '86400']);
			}
		} catch (err) {
			res.status(500).json({ ok: false, error: 'rate_limit_unavailable', message: String(err.message || err) });
			return;
		}

		if (newCount > dailyLimit) {
			res.status(429).json({ ok: false, error: 'daily_limit_exceeded', message: '오늘 생성 가능한 횟수를 모두 사용했어요. 내일 다시 시도해주세요.' });
			return;
		}
	}

	try {
		const character = await generateCharacter(input);
		res.status(200).json({ ok: true, character, remaining: isBypassed ? null : Math.max(0, dailyLimit - newCount) });
	} catch (err) {
		if (err instanceof QuotaExhaustedError) {
			res.status(429).json({
				ok: false,
				error: 'quota_exhausted',
				message: '오늘 이 서비스가 쓸 수 있는 요청량을 모두 사용했어요. 내일 다시 시도해주세요.',
			});
			return;
		}
		if (err instanceof UpstreamOverloadedError) {
			res.status(503).json({
				ok: false,
				error: 'upstream_overloaded',
				message: '지금 요청이 많아서 잠시 응답이 어려워요. 1~2분 후 다시 시도해주세요.',
			});
			return;
		}
		res.status(500).json({ ok: false, error: 'generation_failed', message: String(err.message || err) });
	}
}
