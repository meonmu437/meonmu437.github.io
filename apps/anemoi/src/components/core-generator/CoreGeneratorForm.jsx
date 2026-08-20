import { useState } from 'react';

const API_URL = import.meta.env.PUBLIC_CORE_API_URL || 'https://meonmeo437.vercel.app/api/generate-core';

const HOUSE_CRYSTAL_OPTIONS = [
	{ id: 'venti', house: '벤티 황실', shortLabel: '금빛 다이아몬드형' },
	{ id: 'belkain', house: '벨카인 대공가', shortLabel: '무색투명 원석형' },
	{ id: 'erden', house: '에르덴 공작가', shortLabel: '호박형' },
	{ id: 'serkad', house: '세르카드 공작가', shortLabel: '별꽃형' },
	{ id: 'maretia', house: '마레티아 공작가', shortLabel: '물방울형' },
];

const CRYSTAL_OPTIONS = [
	...HOUSE_CRYSTAL_OPTIONS,
	{ id: 'random', house: '랜덤', shortLabel: '' },
	{ id: 'custom', house: '직접입력', shortLabel: '' },
];

// '랜덤'은 다섯 가문 코어가 아니라, 가문에 속하지 않은 임의의 보석 하나를
// 골라 '직접입력'을 고른 것처럼 보낸다 — 황실/공작가 색·형태를 그대로
// 재탕하지 않도록 하기 위해서다.
const RANDOM_GEM_POOL = [
	'사파이어', '루비', '에메랄드', '자수정', '오팔', '토파즈', '문스톤', '흑요석', '진주', '터키석',
	'가넷', '스피넬', '아쿠아마린', '페리도트', '시트린', '라피스라줄리', '말라카이트', '자스퍼', '카넬리안', '로즈쿼츠',
	'스모키쿼츠', '타이거아이', '산호', '비취', '투르말린', '크리소프레이즈', '라브라도라이트', '선스톤', '묘안석', '오닉스',
];

function pickRandomGemName() {
	return RANDOM_GEM_POOL[Math.floor(Math.random() * RANDOM_GEM_POOL.length)];
}

const SYSTEM_OPTIONS = [
	{ id: '강화형', shortDesc: '신체 능력을 보조하는 계통', examples: ['근력 강화', '반사신경 상승'] },
	{ id: '감각형', shortDesc: '존재하는 정보나 흔적을 감지하는 계통', examples: ['야간 투시', '위험 감지'] },
	{ id: '정신형', shortDesc: '인간의 정신과 인식에 관련된 계통', examples: ['집중력 강화', '감정 감지'] },
	{ id: '현상형', shortDesc: '현실의 물리 현상에 직접 영향을 주는 계통', examples: ['화염 조작', '얼음 생성'] },
];

function getAdminToken() {
	if (typeof location === 'undefined') return '';
	return new URLSearchParams(location.search).get('dev') || '';
}

function appraisalToText(appraisal) {
	const section = (title, items) => [`## ${title}`, ...items.map((line) => `* ${line}`)].join('\n');
	return [
		section('코어의 형태', appraisal.form || []),
		section('능력', appraisal.abilities || []),
		section('약점과 한계', appraisal.weaknesses || []),
	].join('\n\n');
}

export default function CoreGeneratorForm() {
	const [crystalId, setCrystalId] = useState(CRYSTAL_OPTIONS[0].id);
	const [crystalCustom, setCrystalCustom] = useState('');
	const [shape, setShape] = useState('');
	const [systemId, setSystemId] = useState(SYSTEM_OPTIONS[0].id);
	const [detail, setDetail] = useState('');
	const [status, setStatus] = useState('idle'); // idle | loading | done | error
	const [appraisal, setAppraisal] = useState(null);
	const [errorMessage, setErrorMessage] = useState('');
	const [copied, setCopied] = useState(false);

	const system = SYSTEM_OPTIONS.find((s) => s.id === systemId);
	const detailPlaceholder = `예: ${system.examples[0]}, ${system.examples[1]}`;

	async function handleSubmit(event) {
		event.preventDefault();
		setStatus('loading');
		setErrorMessage('');
		setCopied(false);

		const isCustomCrystal = crystalId === 'custom' || crystalId === 'random';
		const resolvedCrystalCustom = crystalId === 'random' ? pickRandomGemName() : crystalCustom.trim();
		const resolvedHouse = isCustomCrystal ? '' : CRYSTAL_OPTIONS.find((c) => c.id === crystalId).house;

		const payload = {
			crystalHouse: resolvedHouse,
			crystalCustom: isCustomCrystal ? resolvedCrystalCustom : '',
			shape: shape.trim(),
			system: systemId,
			detail,
			adminToken: getAdminToken(),
		};

		try {
			const res = await fetch(API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			const data = await res.json();

			if (!res.ok || !data.ok) {
				setStatus('error');
				setErrorMessage(data.message || '코어를 감정하지 못했어요. 잠시 후 다시 시도해주세요.');
				return;
			}

			setAppraisal(data.appraisal);
			setStatus('done');
		} catch {
			setStatus('error');
			setErrorMessage('서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.');
		}
	}

	function handleCopy() {
		if (!appraisal) return;

		function fallbackCopy(text) {
			const textarea = document.createElement('textarea');
			textarea.value = text;
			textarea.style.position = 'fixed';
			textarea.style.opacity = '0';
			document.body.appendChild(textarea);
			textarea.focus();
			textarea.select();
			try {
				document.execCommand('copy');
			} finally {
				document.body.removeChild(textarea);
			}
		}

		function markCopied() {
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1500);
		}

		const text = appraisalToText(appraisal);
		if (navigator.clipboard?.writeText) {
			navigator.clipboard.writeText(text).then(markCopied, () => {
				fallbackCopy(text);
				markCopied();
			});
		} else {
			fallbackCopy(text);
			markCopied();
		}
	}

	return (
		<div className="an-core-gen-sheet not-content">
			<span className="an-core-gen-stamp" aria-hidden="true">◈</span>

			<p className="an-core-gen-eyebrow">Crystal Core Appraisal</p>
			<h3 className="an-core-gen-title">황립 코어 연구원 감정서</h3>
			<p className="an-core-gen-subtitle">제출된 표본의 형태와 계통을 감정하여 기록합니다.</p>
			<hr className="an-core-gen-rule" />

			<form className="an-core-gen-form" onSubmit={handleSubmit}>
				<label className="an-core-gen-field">
					<span>결정</span>
					<select value={crystalId} onChange={(event) => setCrystalId(event.target.value)}>
						{CRYSTAL_OPTIONS.map((c) => (
							<option key={c.id} value={c.id}>
								{c.house}
								{c.shortLabel ? ` · ${c.shortLabel}` : ''}
							</option>
						))}
					</select>
				</label>
				{crystalId === 'custom' && (
					<input
						type="text"
						className="an-core-gen-subfield"
						maxLength={40}
						placeholder="예: 사파이어, 루비"
						value={crystalCustom}
						onChange={(event) => setCrystalCustom(event.target.value)}
					/>
				)}

				<label className="an-core-gen-field">
					<span>형태</span>
					<input
						type="text"
						maxLength={40}
						placeholder="예: 팔각형 (비워두면 랜덤)"
						value={shape}
						onChange={(event) => setShape(event.target.value)}
					/>
				</label>

				<label className="an-core-gen-field">
					<span>계통</span>
					<select value={systemId} onChange={(event) => setSystemId(event.target.value)}>
						{SYSTEM_OPTIONS.map((s) => (
							<option key={s.id} value={s.id}>{s.id} - {s.shortDesc}</option>
						))}
					</select>
				</label>
				<input
					type="text"
					className="an-core-gen-subfield"
					maxLength={80}
					placeholder={detailPlaceholder}
					value={detail}
					onChange={(event) => setDetail(event.target.value)}
				/>

				<button type="submit" className="an-core-gen-submit" disabled={status === 'loading'}>
					{status === 'loading' ? '감정 중...' : '코어 감정하기'}
				</button>
			</form>

			{status === 'error' && <p className="an-core-gen-error">{errorMessage}</p>}

			{status === 'done' && appraisal && (
				<div className="an-core-gen-result">
					<div className="an-core-gen-result-header">
						<p className="an-core-gen-result-label">감정 결과</p>
						<button type="button" className="an-core-gen-copy" onClick={handleCopy}>
							{copied ? '복사됨' : '문구 복사'}
						</button>
					</div>

					<div className="an-core-gen-result-section">
						<h4>코어의 형태</h4>
						<ul>
							{(appraisal.form || []).map((line, i) => <li key={i}>{line}</li>)}
						</ul>
					</div>
					<div className="an-core-gen-result-section">
						<h4>능력</h4>
						<ul>
							{(appraisal.abilities || []).map((line, i) => <li key={i}>{line}</li>)}
						</ul>
					</div>
					<div className="an-core-gen-result-section">
						<h4>약점과 한계</h4>
						<ul>
							{(appraisal.weaknesses || []).map((line, i) => <li key={i}>{line}</li>)}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
}
