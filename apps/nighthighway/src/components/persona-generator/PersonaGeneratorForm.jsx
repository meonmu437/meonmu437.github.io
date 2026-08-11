import { useState } from 'react';
import { createPortal } from 'react-dom';

const API_URL = import.meta.env.PUBLIC_CHARACTER_API_URL || 'https://meonmeo437.vercel.app/api/generate';
const MIN_AGE = 20;

function getAdminToken() {
	if (typeof location === 'undefined') return '';
	return new URLSearchParams(location.search).get('dev') || '';
}

const GENDER_OPTIONS = ['여성', '남성', '랜덤'];
const OCCUPATION_OPTIONS = [
	'라이더',
	'지도 제작자',
	'정비공',
	'정거장 진료소 의사',
	'무전 중계사',
	'정거장 내 일반 주민',
	'직접입력',
];
// 관계 유형은 태그처럼 여러 개를 동시에 고를 수 있다 (예: 소꿉친구 + 혐관).
const RELATIONSHIP_TAGS = ['전연인', '동료', '혐관', '소꿉친구'];

// 태그 단어만 보내면 모델이 뉘앙스를 놓치는 경우가 있어서, 짧은 설명을 같이
// 붙여 보낸다. 값이 함수이면 상대 라이더 이름을 받아 설명을 만든다.
const RELATIONSHIP_TYPE_DESCRIPTIONS = {
	전연인: '과거에 연인 관계였다가 지금은 헤어진 사이',
	동료: '함께 일하거나 다니며 신뢰를 쌓은 동료 관계',
	혐관: '서로를 꺼리거나 사이가 나쁜 관계',
	소꿉친구: (riderName) => `${riderName}와 같은 정거장에서 어릴 때부터 함께 자라온 오래된 친구 관계`,
};

const RIDERS = [
	{ id: 'noe', name: 'Noé Valenti (노에 발렌티) — COYOTE', enabled: true },
	{ id: 'camille', name: 'Camille Moreau (카미유 모로) — CANARY', enabled: false },
];

const RESULT_FIELDS = [
	{ key: 'gender', label: '성별' },
	{ key: 'nationality', label: '국적' },
	{ key: 'occupation', label: '직업' },
	{ key: 'callsign', label: '콜사인' },
	{ key: 'bike', label: '바이크' },
	{ key: 'appearance', label: '외모' },
	{ key: 'clothing', label: '복장' },
	{ key: 'personality', label: '성격' },
	{ key: 'likes', label: '좋아하는 것', isList: true },
	{ key: 'dislikes', label: '싫어하는 것', isList: true },
	{ key: 'habits', label: '특징/습관' },
	{ key: 'background', label: '배경' },
	{ key: 'relationshipStory', label: '관계 서사' },
];

function visibleFields(character) {
	return RESULT_FIELDS.filter((f) => {
		const value = character[f.key];
		return f.isList ? Array.isArray(value) && value.length > 0 : !!value;
	});
}

function characterToText(character) {
	const lines = [`${character.name} (${character.age}세)`];
	visibleFields(character).forEach((f) => {
		const value = character[f.key];
		lines.push(`- ${f.label}: ${f.isList && Array.isArray(value) ? value.join(', ') : value}`);
	});
	return lines.join('\n');
}

function composeRelationship(riderId, relationTags, relationCustom) {
	// 상대 라이더를 고르지 않았으면 관계 서사 자체를 만들지 않는다 — 배경만으로
	// 충분한 페르소나 소개가 되도록 한다.
	const rider = RIDERS.find((r) => r.id === riderId);
	if (!rider) return '';

	const parts = relationTags.map((tag) => {
		const entry = RELATIONSHIP_TYPE_DESCRIPTIONS[tag];
		const description = typeof entry === 'function' ? entry(rider.name) : entry;
		return description ? `${tag}(${description})` : tag;
	});

	const custom = relationCustom.trim();
	if (custom) parts.push(custom);

	if (parts.length === 0) return `${rider.name}와의 관계 (관계 성격은 랜덤)`;
	return `${rider.name}와 ${parts.join(' + ')} 관계`;
}

export default function PersonaGeneratorForm() {
	const [name, setName] = useState('');
	const [gender, setGender] = useState('랜덤');
	const [age, setAge] = useState('');
	const [nationality, setNationality] = useState('');
	const [occupation, setOccupation] = useState('정거장 내 일반 주민');
	const [occupationCustom, setOccupationCustom] = useState('');
	const [personality, setPersonality] = useState('');
	const [appearance, setAppearance] = useState('');
	const [riderId, setRiderId] = useState('');
	const [relationTags, setRelationTags] = useState([]);
	const [relationCustom, setRelationCustom] = useState('');
	const [feature, setFeature] = useState('');

	const [ageNotice, setAgeNotice] = useState(false);
	const [status, setStatus] = useState('idle'); // idle | loading | done | error
	const [character, setCharacter] = useState(null);
	const [errorMessage, setErrorMessage] = useState('');
	const [copied, setCopied] = useState(false);

	function handleAgeChange(value) {
		setAge(value.replace(/[^0-9]/g, '').slice(0, 2));
	}

	function handleAgeBlur() {
		if (age !== '' && Number(age) < MIN_AGE) {
			setAgeNotice(true);
			setAge(String(MIN_AGE));
		}
	}

	function toggleRelationTag(tag) {
		setRelationTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
	}

	async function handleSubmit(event) {
		event.preventDefault();

		setStatus('loading');
		setErrorMessage('');
		setCopied(false);

		const payload = {
			name,
			gender: gender === '랜덤' ? '' : gender,
			age: age || undefined,
			nationality,
			occupation: occupation === '직접입력' ? occupationCustom : occupation,
			personality,
			appearance,
			relationship: composeRelationship(riderId, relationTags, relationCustom),
			riderId,
			feature,
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
				setErrorMessage(data.message || '캐릭터를 만들지 못했어요. 잠시 후 다시 시도해주세요.');
				return;
			}

			setCharacter(data.character);
			setStatus('done');
		} catch {
			setStatus('error');
			setErrorMessage('서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.');
		}
	}

	async function handleCopy() {
		if (!character) return;
		try {
			await navigator.clipboard.writeText(characterToText(character));
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// clipboard API 접근이 막힌 환경에서는 조용히 무시한다.
		}
	}

	return (
		<div className="nh-persona-device not-content">
			<div className="nh-persona-antenna" />
			<div className="nh-persona-body">
				<div className="nh-persona-screws">
					<span />
					<span />
				</div>

				<div className="nh-persona-header">
					<div>
						<p className="nh-persona-title">NIGHT HIGHWAY</p>
						<p className="nh-persona-subtitle">Persona Synthesizer</p>
					</div>
					<span className="nh-persona-model">NH-P22</span>
				</div>

				<div className="nh-persona-screen-bezel">
					<div className="nh-persona-screen">
						<form className="nh-persona-form" onSubmit={handleSubmit}>
							<label className="nh-persona-field">
								<span>이름</span>
								<input
									type="text"
									placeholder="원하는 이름이 있다면 (비워두면 랜덤)"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</label>

							<label className="nh-persona-field">
								<span>성별</span>
								<select value={gender} onChange={(e) => setGender(e.target.value)}>
									{GENDER_OPTIONS.map((opt) => (
										<option key={opt} value={opt}>
											{opt}
										</option>
									))}
								</select>
							</label>

							<label className="nh-persona-field">
								<span>나이</span>
								<input
									type="text"
									inputMode="numeric"
									placeholder={`${MIN_AGE}세 이상 (비워두면 랜덤)`}
									value={age}
									onChange={(e) => handleAgeChange(e.target.value)}
									onBlur={handleAgeBlur}
								/>
							</label>

							<label className="nh-persona-field">
								<span>국적</span>
								<input
									type="text"
									placeholder="예: 프랑스 (비워두면 랜덤)"
									value={nationality}
									onChange={(e) => setNationality(e.target.value)}
								/>
							</label>

							<label className="nh-persona-field">
								<span>직업</span>
								<select value={occupation} onChange={(e) => setOccupation(e.target.value)}>
									{OCCUPATION_OPTIONS.map((opt) => (
										<option key={opt} value={opt}>
											{opt}
										</option>
									))}
								</select>
							</label>
							{occupation === '직접입력' && (
								<input
									type="text"
									className="nh-persona-subfield"
									placeholder="원하는 직업을 입력해주세요"
									value={occupationCustom}
									onChange={(e) => setOccupationCustom(e.target.value)}
								/>
							)}

							<label className="nh-persona-field">
								<span>성격 키워드</span>
								<input
									type="text"
									placeholder="예: 무심함, 장난기 (비워두면 랜덤)"
									value={personality}
									onChange={(e) => setPersonality(e.target.value)}
								/>
							</label>

							<label className="nh-persona-field">
								<span>외모</span>
								<input
									type="text"
									placeholder="원하는 외모가 있다면 (비워두면 랜덤)"
									value={appearance}
									onChange={(e) => setAppearance(e.target.value)}
								/>
							</label>

							<label className="nh-persona-field">
								<span>관계 — 상대 라이더</span>
								<select value={riderId} onChange={(e) => setRiderId(e.target.value)}>
									<option value="">선택 안 함 (관계 서사 없음)</option>
									{RIDERS.map((r) => (
										<option key={r.id} value={r.id} disabled={!r.enabled}>
											{r.name}
											{!r.enabled ? ' (준비중)' : ''}
										</option>
									))}
								</select>
							</label>

							<label className="nh-persona-field">
								<span>관계 — 관계 유형 (여러 개 선택 가능)</span>
								<div className="nh-persona-tag-group" aria-disabled={!riderId}>
									{RELATIONSHIP_TAGS.map((tag) => (
										<button
											key={tag}
											type="button"
											className={'nh-persona-tag' + (relationTags.includes(tag) ? ' is-active' : '')}
											disabled={!riderId}
											onClick={() => toggleRelationTag(tag)}
										>
											{tag}
										</button>
									))}
								</div>
								<input
									type="text"
									className="nh-persona-subfield"
									placeholder="직접 설명을 추가하고 싶다면 (예: 어릴 땐 친했지만 지금은 소원함)"
									value={relationCustom}
									onChange={(e) => setRelationCustom(e.target.value)}
									disabled={!riderId}
								/>
							</label>

							<label className="nh-persona-field">
								<span>추가 특징</span>
								<input
									type="text"
									placeholder="넣고 싶은 디테일이 있다면 (선택)"
									value={feature}
									onChange={(e) => setFeature(e.target.value)}
								/>
							</label>

							<button type="submit" className="nh-persona-submit" disabled={status === 'loading'}>
								<span aria-hidden="true">◉</span>
								<span>{status === 'loading' ? '생성 중...' : '페르소나 생성하기'}</span>
								<span aria-hidden="true">▶</span>
							</button>
						</form>

						{status === 'error' && <p className="nh-persona-error">{errorMessage}</p>}

						{status === 'done' && character && (
							<div className="nh-persona-result">
								<div className="nh-persona-result-header">
									<h3>
										{character.name} <span>{character.age}세</span>
									</h3>
									<button type="button" className="nh-persona-copy" onClick={handleCopy}>
										{copied ? '복사됨 ✓' : '텍스트 복사'}
									</button>
								</div>
								<table className="nh-persona-result-table">
									<tbody>
										{visibleFields(character).map((f) => (
											<tr key={f.key}>
												<th>{f.label}</th>
												<td>{f.isList && Array.isArray(character[f.key]) ? character[f.key].join(', ') : character[f.key]}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</div>
			</div>

			{ageNotice &&
				typeof document !== 'undefined' &&
				createPortal(
					<div
						className="nh-jsx-alarm-overlay not-content"
						role="alertdialog"
						aria-modal="true"
						onClick={(event) => {
							if (event.target === event.currentTarget) setAgeNotice(false);
						}}
					>
						<div className="nh-jsx-alarm-box">
							<p className="nh-jsx-alarm-tag" aria-hidden="true">
								⚠ DEVICE ALERT
							</p>
							<p className="nh-jsx-alarm-title">나이 제한</p>
							<p className="nh-jsx-alarm-message">
								이 세계관의 캐릭터는 {MIN_AGE}세 이상으로만 설정할 수 있어요. 나이를 {MIN_AGE}세로 조정했어요.
							</p>
							<button type="button" className="nh-jsx-alarm-close" onClick={() => setAgeNotice(false)}>
								확인
							</button>
						</div>
					</div>,
					document.body
				)}
		</div>
	);
}
