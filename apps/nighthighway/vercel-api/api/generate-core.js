import { createHash } from 'node:crypto';
import worldBible from '../data/anemoi-world-bible.js';

const VALID_SYSTEMS = ['강화형', '감각형', '정신형', '현상형'];

const CORE_SCHEMA = {
	type: 'OBJECT',
	properties: {
		form: { type: 'ARRAY', items: { type: 'STRING' } },
		abilities: { type: 'ARRAY', items: { type: 'STRING' } },
		weaknesses: { type: 'ARRAY', items: { type: 'STRING' } },
	},
	required: ['form', 'abilities', 'weaknesses'],
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

function buildPrompt(input) {
	const houseCrystalLines = worldBible.houseCrystals.map((h) => `- ${h.house}: ${h.desc}`).join('\n');
	const systemLines = worldBible.coreSystems.map((s) => `- ${s.id}: ${s.desc}`).join('\n');
	const systemDesc = worldBible.coreSystems.find((s) => s.id === input.system)?.desc || '';

	const crystalLine = input.crystalHouse
		? `- 결정(크리스탈) 가문: ${input.crystalHouse} — 이 가문의 전통적인 코어 형태를 기반으로 하되, 그대로 베끼지 말고 이 개체만의 변형(색의 농담, 결의 방향, 흠집, 내부 무늬 등)을 더할 것.`
		: `- 결정(크리스탈): 사용자가 직접 지정한 보석 — "${input.crystalCustom}". 이 보석의 특징을 살리되 이 세계관의 크리스탈 코어답게 재해석할 것 (실제 보석 그대로의 광물학적 성질을 나열하지 말 것).`;

	const shapeLine = input.shape
		? `- 형태 지정: "${input.shape}" 모양을 이 코어의 기본 형태로 삼을 것.`
		: `- 형태 지정: 없음 — 가문·계통 특성에 어울리는 형태를 자유롭게 정할 것.`;

	return `당신은 "아네모이(ANEMOI)"라는 로맨스 판타지 제국을 배경으로, 등장인물의 크리스탈 코어를 감정(鑑定)하는 황립 연구원의 글을 쓰는 작가입니다.

# 세계관 설정
${worldBible.setting}

## 세계관 사실
${worldBible.worldFacts.map((f) => `- ${f}`).join('\n')}

## 다섯 가문의 전통적인 코어 형태 (참고용)
${houseCrystalLines}

## 코어의 네 계통
${systemLines}

## 반드시 지킬 것 (톤/세계관 가드레일)
${worldBible.toneGuardrails.map((g) => `- ${g}`).join('\n')}

# 감정 요청 내용
${crystalLine}
${shapeLine}
- 계통: ${input.system} — ${systemDesc}
- 사용자가 적은 추가 세부 능력 요청: ${input.detail || '(없음 — 계통에 어울리는 능력을 자유롭게 구체화할 것)'}

# 작성 규칙
1. 응답은 세 부분으로 구성됩니다: form(코어의 형태), abilities(능력), weaknesses(약점과 한계).
2. form: 이 코어의 겉모습을 구체적으로 묘사하는 문장 2개. 크기, 색, 결, 빛을 받았을 때의 느낌 등 감각적인 디테일을 포함할 것.
3. abilities: 이 능력이 실제로 어떻게 작동하는지 4~6개의 문장으로 구체적으로 설명할 것. 추상적인 설명("모든 것을 알 수 있다" 등)이 아니라, 구체적인 상황에서 무엇을 할 수 있고 무엇을 할 수 없는지 명확한 경계를 보여줄 것. 사용자가 적은 추가 세부 능력 요청이 있다면 그 능력을 abilities의 중심 소재로 반드시 반영할 것.
4. weaknesses: 이 능력의 대가나 한계를 2개의 문장으로 설명할 것. 만능이 아니라 뚜렷한 약점이 있어야 한다.
5. 모든 문장은 한국어 평서문(~다체)으로, 대화체나 존댓말 없이 작성할 것.
6. 같은 가문·같은 계통이라도 이 개체만의 고유한 디테일이 드러나야 한다 — 뻔한 설명을 피할 것.

지정된 JSON 스키마에 맞춰 감정 결과만 응답하세요.`;
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
				responseSchema: CORE_SCHEMA,
				temperature: 1,
			},
		}),
	});

	if (!res.ok) {
		const errText = await res.text();
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

async function generateAppraisal(input) {
	return callGemini(buildPrompt(input));
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

	const system = VALID_SYSTEMS.includes(body.system) ? body.system : '';
	if (!system) {
		res.status(400).json({ ok: false, error: 'invalid_system', message: '계통 값이 올바르지 않습니다.' });
		return;
	}

	const crystalHouse = sanitizeText(body.crystalHouse, 20);
	const crystalCustom = sanitizeText(body.crystalCustom, 40);
	if (!crystalHouse && !crystalCustom) {
		res.status(400).json({ ok: false, error: 'invalid_crystal', message: '결정 정보가 필요합니다.' });
		return;
	}

	const input = {
		crystalHouse,
		crystalCustom,
		shape: sanitizeText(body.shape, 40),
		system,
		detail: sanitizeText(body.detail, 80),
	};

	// 이 엔드포인트는 나이트하이웨이 페르소나 생성기(api/generate.js)와 같은
	// Vercel 프로젝트·Gemini 키·Upstash 인스턴스를 공유하지만, 요청 제한
	// 카운터 키는 'rl:core:' 접두어로 분리한다 — 두 생성기가 하나의 하루
	// 5회 한도를 서로 갉아먹지 않게 하기 위해서다.
	const dailyLimit = Number(process.env.DAILY_LIMIT || '5');
	let newCount = 0;

	if (!isBypassed) {
		const forwardedFor = req.headers['x-forwarded-for'];
		const ip = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor || '').split(',')[0].trim() || 'unknown';
		const ipHash = hashIp(ip, process.env.RATE_LIMIT_SALT || '');
		const rateLimitKey = `rl:core:${ipHash}:${todayUtc()}`;

		try {
			newCount = Number(await upstash(['INCR', rateLimitKey]));
			if (newCount === 1) {
				await upstash(['EXPIRE', rateLimitKey, '86400']);
			}
		} catch (err) {
			res.status(500).json({ ok: false, error: 'rate_limit_unavailable', message: String(err.message || err) });
			return;
		}

		if (newCount > dailyLimit) {
			res.status(429).json({ ok: false, error: 'daily_limit_exceeded', message: '오늘 감정 가능한 횟수를 모두 사용했어요. 내일 다시 시도해주세요.' });
			return;
		}
	}

	try {
		const appraisal = await generateAppraisal(input);
		res.status(200).json({ ok: true, appraisal, remaining: isBypassed ? null : Math.max(0, dailyLimit - newCount) });
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
