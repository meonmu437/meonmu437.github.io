import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import FieldLog from './FieldLog.jsx';
import SocietyGazette from './SocietyGazette.jsx';
import RequestBoard from './RequestBoard.jsx';
import EventInvitations from './EventInvitations.jsx';

// 이 컴포넌트들은 원래 캐릭터챗 서비스의 위젯 샌드박스에서 실행되며, 그
// 환경이 전역으로 제공하는 sendMessage(캐릭터의 응답 전송 함수)를 가정하고
// 만들어졌다. 이 미리보기 페이지에는 그런 백엔드가 없으니, 버튼을 눌렀을 때
// 원래 컴포넌트가 만드는 내부용 명령어 문자열을 그대로 보여주는 대신, 그
// 문자열에서 필요한 값만 뽑아 실제로 알림이 뜬 것처럼 보이는 짧은 문구로
// 바꿔 보여준다.
function buildAlarmFromMessage(text) {
	const missionMatch = /title:\s*"([^"]*)"/.exec(text);
	if (missionMatch) {
		return { icon: '⚔', title: '의뢰 수락', message: `"${missionMatch[1]}" 의뢰를 수락했습니다.` };
	}

	return { icon: '✦', title: '초대 응답', message: text };
}

const COMMANDS = [
	{
		key: 'gazette',
		slash: '/신문',
		label: '사교계 가제트',
		render: () => <SocietyGazette />,
	},
	{
		key: 'invitation',
		slash: '/초대장',
		label: '행사 초대장',
		render: () => <EventInvitations />,
	},
	{
		key: 'request',
		slash: '/의뢰',
		label: '사냥 의뢰서',
		render: () => <RequestBoard />,
	},
	{
		key: 'fieldlog',
		slash: '/기록',
		label: '야외 기록장',
		render: () => <FieldLog />,
	},
];

export default function AnemoiPreviewTerminal() {
	const [active, setActive] = useState(COMMANDS[0].key);
	const [alarm, setAlarm] = useState(null);
	const current = COMMANDS.find((c) => c.key === active) ?? COMMANDS[0];

	useEffect(() => {
		window.sendMessage = (text) => {
			setAlarm(buildAlarmFromMessage(String(text ?? '')));
			return true;
		};
	}, []);

	// 테마 토글의 경고 알람과 같은 방식: 자동으로 안 사라지고 Esc나 바깥
	// 클릭, 확인 버튼으로만 닫힌다.
	useEffect(() => {
		if (!alarm) return;
		const onKeydown = (event) => {
			if (event.key === 'Escape') setAlarm(null);
		};
		document.addEventListener('keydown', onKeydown);
		return () => document.removeEventListener('keydown', onKeydown);
	}, [alarm]);

	return (
		<div className="an-jsx-preview not-content">
			<div className="an-jsx-cmdline">
				<div className="an-jsx-cmds">
					{COMMANDS.map((c) => (
						<button
							key={c.key}
							type="button"
							className={'an-jsx-cmd' + (c.key === active ? ' is-active' : '')}
							onClick={() => setActive(c.key)}
						>
							<span className="an-jsx-cmd-slash">{c.slash}</span>
							<span className="an-jsx-cmd-label">{c.label}</span>
						</button>
					))}
				</div>
			</div>
			<div className="an-jsx-stage">{current.render()}</div>

			{alarm &&
				typeof document !== 'undefined' &&
				createPortal(
					// 스크롤 리빌 애니메이션이 이 섹션에 inline transform을 남겨 두면
					// position:fixed 자손은 그 transform이 있는 조상을 기준으로 위치가
					// 잡힌다. document.body에 바로 포털로 그려서 화면(뷰포트) 기준
					// 정중앙에 정확히 뜨게 한다.
					<div
						className="an-jsx-alarm-overlay not-content"
						role="alertdialog"
						aria-modal="true"
						onClick={(event) => {
							if (event.target === event.currentTarget) setAlarm(null);
						}}
					>
						<div className="an-jsx-alarm-box">
							<p className="an-jsx-alarm-tag" aria-hidden="true">
								{alarm.icon} DEVICE ALERT
							</p>
							<p className="an-jsx-alarm-title">{alarm.title}</p>
							<p className="an-jsx-alarm-message">{alarm.message}</p>
							<button type="button" className="an-jsx-alarm-close" onClick={() => setAlarm(null)}>
								확인
							</button>
						</div>
					</div>,
					document.body
				)}
		</div>
	);
}
