import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import RadioTransmissionTerminal from './RadioTransmissionTerminal.jsx';
import CharacterWidgets from './CharacterWidgets.jsx';
import RiderRequestTerminal from './RiderRequestTerminal.jsx';
import RiderClientReviewBoard from './RiderClientReviewBoard.jsx';
import RoadLogbook from './RoadLogbook.jsx';

// 컴포넌트들은 원래 엘린(캐릭터챗 서비스)의 위젯 샌드박스에서 실행되며,
// 그 환경이 전역으로 제공하는 sendMessage(캐릭터의 응답 전송 함수)를
// 가정하고 만들어졌다. 이 미리보기 페이지에는 그런 백엔드가 없으니,
// 버튼을 눌렀을 때 원래 컴포넌트가 만드는 내부용 명령어 문자열({{char}}...,
// missionTitle = "..." 같은 것)을 그대로 보여주는 대신, 그 문자열에서
// 필요한 값만 뽑아 단말기가 실제로 알림을 띄운 것처럼 보이는 짧은 문구로
// 바꿔 보여준다.
function buildAlarmFromMessage(text) {
	const missionMatch = /missionTitle\s*=\s*"([^"]*)"/.exec(text);
	if (missionMatch) {
		return { icon: '▣', title: '의뢰 수락', message: `"${missionMatch[1]}" 의뢰를 수락했습니다.` };
	}

	const freqMatch = /([\d.]+\s*MHz)/.exec(text);
	if (freqMatch) {
		return { icon: 'ϟ', title: '무전 송신', message: `${freqMatch[1]} 주파수로 응답을 전송했습니다.` };
	}

	return { icon: '✓', title: '전송 완료', message: '전송이 완료되었습니다.' };
}

const RADIO_DATA = [
{
"messages": [
{
"sender": "17번 정거장 관제실",
"frequency": "104.7 MHz",
"date": "3월 28일",
"time": "22:42",
"content": "공지한다. SS16 해안 간선도로 남하 노선에서 정체불명의 신호 교란이 보고되었다.\n\n이 지역을 통과하는 모든 라이더는 비공식 중계 채널을 피하고, 정식 지정 주파수만을 사용할 것.\n\n해안가 폐어촌 구역은 현재 치안 공백 지대다. 야간 정차를 극도로 자제하라."
},
{
"sender": "라이더 FOXTAIL",
"frequency": "101.3 MHz",
"date": "3월 28일",
"time": "22:45",
"content": "아, 관제실 말 들어서 나쁠 거 없다.\n\n방금 전방 5km 지점에서 라이트 다 끈 검은색 픽업트럭 두 대가 해안 도로 진입로를 가로막고 서 있는 걸 봤어.\n\n다들 그쪽으로 대가리 들이밀지 마라. 약탈자 매복 냄새가 풀풀 난다."
},
{
"sender": "정비소 CHIP",
"frequency": "98.5 MHz",
"date": "3월 28일",
"time": "22:48",
"content": "누가 볼로냐 동쪽 폐차장에 고장 난 발전기 버리고 갔냐?\n\n구리 배선만 다 털어가고 알맹이는 썩려놨네. 양심 터진 놈들.\n\n혹시 쓸만한 디젤 필터 가지고 들어오는 라이더 있으면 바로 정비소로 와라. 크레딧 넉넉히 쳐준다."
},
{
"sender": "의료반 GREEN",
"frequency": "105.2 MHz",
"date": "3월 28일",
"time": "22:50",
"content": "알립니다. 북부 터널 임시 진료소는 현재 의약품 재고가 소진되어 야간 응급 수령이 불가능합니다.\n\n해독제나 항생제가 필요한 환자는 서부 12번 정거장으로 우회해 주십시오.\n\n도로 상황 악화로 추가 보급 대기 시간이 길어지고 있습니다."
},
{
"sender": "라이더 IBEX",
"frequency": "101.3 MHz",
"date": "3월 28일",
"time": "22:54",
"content": "여기는 IBEX. 방금 SS16 국도 22km 지점 통과했다.\n\n노면 상태 최악이다. 지난주 폭우로 지반 깎여 나간 곳에 아스팔트가 완전히 갈라졌어.\n\n대형 운송 트럭들은 바퀴 빠지기 딱 좋으니까 감속해라. 우회로는 없다."
},
{
"sender": "상인 연합 조합",
"frequency": "103.1 MHz",
"date": "3월 28일",
"time": "22:57",
"content": "라벤나 남부 검문소 통행료 인상 건에 대해 알린다.\n\n오늘 밤 자정부터 비등록 라이더는 통행료가 기존의 두 배인 150 CR로 인상된다.\n\n정식 통행증이 없는 자들은 정거장 발행 위임장을 반드시 지참해라. 실랑이해봤자 총구만 들려올 거다."
},
{
"sender": "라이더 KRI-KRI",
"frequency": "101.3 MHz",
"date": "3월 28일",
"time": "23:02",
"content": "150 크레딧? 진짜 미쳤군, 날강도 새끼들.\n\n그 돈 낼 바에는 그냥 진흙 구덩이로 주행하는 게 낫겠어.\n\n야, FOXTAIL. 너 아까 말한 픽업트럭들, 우회해서 갈 수 있는 해안 샛길은 완전히 막힌 거야? 알려주면 담배 한 갑 쏜다."
},
{
"sender": "라이더 FOXTAIL",
"frequency": "101.3 MHz",
"date": "3월 28일",
"time": "23:05",
"content": "KRI-KRI, 그 샛길은 아예 잊어버려.\n\n만조 시간 겹치면 거긴 그냥 바닷물에 잠기는 수렁이야. 바이크 엔진 다 버려 먹고 싶으면 들어가든지.\n\n차라리 통행료 내고 검문소 통과하는 게 네 목숨값보단 쌀 거다."
},
{
"sender": "순찰대 VANGUARD",
"frequency": "104.7 MHz",
"date": "3월 28일",
"time": "23:09",
"content": "경고한다. 최근 남서부 중계망에서 호출부호 'COYOTE'를 무단 도용하여 허위 정보를 유포하는 정황이 포착되었다.\n\n해당 호출부호로 들어오는 무전은 공식 수신 기록에 등록되지 않은 가짜 신호일 가능성이 높다.\n\n라이더들은 출처가 불분명한 지시나 경로 추천에 절대 따르지 말 것."
},
{
"sender": "라이더 COYOTE (노에)",
"frequency": "101.3 MHz",
"date": "3월 28일",
"time": "23:12",
"content": "아아, 마이크 테스트. 거 참 귀찮게 구네.\n\n누가 내 이름을 그렇게 싸구려처럼 쓰고 다니는지 모르겠는데, 내가 진짜 코요테다.\n\n진짜는 지금 아주 끝내주는 곳에서 최고의 파트너랑 쉬고 있으니까, 그 흉내쟁이 새끼 만나면 내 바이크 실린더로 대가리를 깨버려 달라고 전해줘. 알겠지, 베이비들?"
}
]
}
];
const REQUEST_DATA = [
{
"dateTime": "3월 20일 · 11:45",
"channel": "CH.12",
"requests": [
{
"id": "REQ-0173",
"type": "DELIVERY",
"title": "북부 터널 긴급 의약품 운송",
"issuer": "17번 정거장 의료반",
"origin": "17번 정거장 (K7M-4Q2)",
"destination": "북부 터널 임시 진료소",
"reward": "420 CR",
"deadline": "일출 2시간 전",
"risk": "HIGH",
"status": "OPEN",
"summary": "냉각 보관이 필요한 의료 상자 세 개를 북부 터널의 임시 진료소까지 운송한다. 주요 진입로 붕괴, 약탈자 활동 보고 있음."
},
{
"id": "REQ-0174",
"type": "ESCORT",
"title": "지도 제작자 호송 및 경로 검증",
"issuer": "독립 지도 제작자 연합",
"origin": "17번 정거장 (K7M-4Q2)",
"destination": "45번 중계탑",
"reward": "350 CR + 경로 데이터",
"deadline": "48시간 이내",
"risk": "MEDIUM",
"status": "OPEN",
"summary": "지도 제작자 한 명을 45번 중계탑까지 안전하게 호송하고, 미확인 우회로의 실사용 가능성을 검증한다."
},
{
"id": "REQ-0175",
"type": "RECOVERY",
"title": "실종 정찰팀 기록 장치 회수",
"issuer": "21번 정거장 보안팀",
"origin": "북부 섹터 델타 지점",
"destination": "21번 정거장 (N4P-1A9)",
"reward": "600 CR",
"deadline": "제한 없음",
"risk": "HIGH",
"status": "OPEN",
"summary": "지난주 연락이 두절된 정찰팀의 차량에서 블랙박스와 항법 기록 장치를 회수한다. 생존자 수색은 부차 목표."
}
]
}
];
const WIDGET_DATA = [
{
"characterName": "Noé Valenti",
"dateTime": "3월 14일 토요일 · 10:30",
"banking": {
"balance": "1,120",
"history": [
{"id": 1, "store": "17번 정거장 의무실 소독제", "price": "-45", "date": "10:15"},
{"id": 2, "store": "하부 격납고 허스 정비 공임", "price": "-120", "date": "08:30"},
{"id": 3, "store": "동부 삼거리 견인 의뢰 정산", "price": "+350", "date": "어제 21:05"},
{"id": 4, "store": "09번 정거장 고속 충전 연료", "price": "-80", "date": "03.11"},
{"id": 5, "store": "의약품 긴급 수송 완료 보수", "price": "+1,500", "date": "03.07"}
]
},
"messages": [
{"id": 1, "sender": "정거장 기술반", "text": "의뢰(REQ-0211) 수락 대기 중. 출발 전 정거장 서부 자재 창고에서 신형 무전 모듈을 수령하십시오.", "time": "10:26"},
{"id": 2, "sender": "ROOK", "text": "너 진짜 기어 나왔냐? 귀신 얘기인 줄 알았는데. 살아있으면 정거장 바에서 술이나 한잔 사든가.", "time": "09:40"},
{"id": 3, "sender": "VOLK", "text": "허스가 하부 격납고에 있는 걸 확인했다. 유령이 아니라면 조만간 도로 위에서 보겠군. 몸 사려라.", "time": "08:15"},
{"id": 4, "sender": "IBEX", "text": "북쪽 구덩이 인근에서 네 무덤 흔적을 봤다. 무모한 짓은 여전하군. 치료 끝나면 장비나 제대로 점검해라.", "time": "07:50"},
{"id": 5, "sender": "Mia", "text": "다시 내 눈앞에 나타나면 그땐 진짜 지도가 아니라 네 다리를 부러뜨릴 줄 알아. 다신 오지 마.", "time": "6개월 전"}
],
"search": [
{"id": 1, "query": "17번 정거장 서부 계곡 우회로 낙석 빈도", "date": "5분 전"},
{"id": 2, "query": "으스러진 들꽃 살리는 법", "date": "12분 전"},
{"id": 3, "query": "왼팔 골절 빠른 회복 자가치료", "date": "1시간 전"},
{"id": 4, "query": "허스 무소음 모드 배터리 소모율", "date": "3시간 전"},
{"id": 5, "query": "마르세유 정거장 복구 생존자 명단", "date": "어제"}
],
"notes": [
{"id": 1, "title": "서부 우회로 계획", "content": "계곡 진입 전 구도로 우회. 낙석 다발 구역은 엔진 무소음 모드로 통과할 것. 유저의 구형 지도가 유효함.", "date": "03.14"},
{"id": 2, "title": "챙겨야 할 물건", "content": "허스 예비 퓨즈, 유저의 수제 지도 사본, 진통제 여분, 소독용 알코올, 가죽 장갑 새로 구할 것.", "date": "03.14"},
{"id": 3, "title": "유저한테 해야 할 말", "content": "이번엔 농담으로 대충 때우지 말 것. 그 구덩이 속에서 마지막까지 생각났던 게 뭔지 똑바로 말하기.", "date": "03.13"},
{"id": 4, "title": "허스 정비 항목", "content": "좌측 프런트 포크 진흙 세척 완료. 클러치 레버 유격 조정 필요. 엔진 가스켓 윤활유 누출 미세 있음.", "date": "03.11"},
{"id": 5, "title": "구덩이 탈출 직후 기록", "content": "살아남았다. 유저에게 간다. 그것 말고는 아무것도 생각하지 않는다. 손끝이 닳아 없어지더라도 기어간다.", "date": "03.09"}
],
"gallery": [
{"id": 1, "type": "DAILY", "time": "오늘 08:32", "desc": "창문 새로 들어오는 아침 햇살을 받아 먼지가 뿌옇게 일어난 유저의 작업대와 잉크병들."},
{"id": 2, "type": "HEARSE", "time": "어제 22:15", "desc": "빗물과 진흙에 젖어 검은 가죽처럼 번들거리는 허스의 연료 탱크와 그 위에 올려둔 상처투성이 헬멧."},
{"id": 3, "type": "SIGNAL", "time": "03.11", "desc": "탈출 직후 황무지 밤하늘을 가로지르던 차가운 초록빛 밤하늘의 궤적과 흐릿한 별무리."},
{"id": 4, "type": "PERSONAL MEMORY", "time": "03.08", "desc": "어두운 구덩이 속에서 손톱이 전부 깨지며 필사적으로 긁어내던 축축한 진흙벽의 끔찍한 윤곽."},
{"id": 5, "type": "LOVE", "time": "6개월 전", "desc": "작업실 구석에 무심히 놓여 있던, 끝부분이 조금 찢어진 유저의 푸른색 수제 지도 모서리와 낡은 제도 자."}
]
}
];
const REVIEW_POSTS = [
    {
      "id": 1,
      "category": "DELIVERY",
      "riderName": "Noé Moretti",
      "callSign": "COYOTE",
      "title": "빠르긴 한데 매너는 황무지에 버리고 온 놈",
      "contract": "의약품 및 급결 보수제 수송",
      "route": "09번 정거장 → 12번 정거장",
      "result": "완료",
      "hireAgain": true,
      "content": "의약품 긴급 수송이라 비싼 값 주고 고용했음. 실력 하나는 확실함. 남들 다 무너졌다고 우회하는 서부 터널을 기어코 돌파해서 예정 시간보다 두 시간이나 일찍 도착함. 화물도 완벽하게 보존됨.\n\n근데 이 자식 말투가 진짜 사람 긁는 데 천재임. 가는 내내 무전으로 농담 따먹기나 하고 계약금 깎으려고 수작 부리는 게 아주 눈에 보임. 실력이 없었으면 벌써 황무지 구덩이에 처박았을 인간임.\n\n돈값은 확실히 하니까 급한 화물 있으면 부르셈. 정신 건강에는 해롭지만 배달 하나는 귀신같이 해냄.",
      "author": "익명 의뢰인 102",
      "time": "2일 전",
      "score": 4,
      "likes": 35,
      "views": 240,
      "tags": ["빠른 배달", "화물 보존", "말이 많음"],
      "clientNote": "무전기로 헛소리하면 그냥 채널을 돌려버리는 것을 추천함. 일은 알아서 함.",
      "commentList": [
        {"id": 1, "author": "익명 의뢰인 044", "content": "얘랑 거래할 때 말려들면 수수료 더 뜯김 조심하셈", "time": "2일 전"},
        {"id": 2, "author": "라이더연합 브로커", "content": "코요테 성격 저래도 노쇼는 안 내니까 믿고 쓰십시오.", "time": "1일 전"}
      ]
    },
    {
      "id": 2,
      "category": "ESCORT",
      "riderName": "Noé Moretti",
      "callSign": "COYOTE",
      "title": "사람 목숨 가지고 장난치진 않는데 기분은 나쁨",
      "contract": "정거장 기술자 기술 교류 파견 호위",
      "route": "17번 정거장 → 03번 정거장",
      "result": "완료",
      "hireAgain": true,
      "content": "약탈자들 자주 출몰하는 외곽 도로 지나는 의뢰였음. 바이크 뒤에 기술자 태우고 가는데, 시종일관 콧노래 부르고 뒤에서 무섭다고 소리 지르니까 즐거워 뒤지려고 하더라. 사디스트가 분명함.\n\n그래도 추격대 붙었을 때 권총 한 자루로 대가리 날려버리는 솜씨 보고 기겁함. 운전 기술도 미쳤음. 기술자 놈이 멀미로 토하기 직전까지 몰아붙이긴 했는데 상처 하나 없이 목적지 도착시킴.\n\n안전하게 가고 싶으면 비추, 확실하게 살아서 가고 싶으면 추천. 성격 다 받아줄 수 있으면 고용하셈.",
      "author": "익명 의뢰인 219",
      "time": "5일 전",
      "score": 4,
      "likes": 42,
      "views": 310,
      "tags": ["전투력 상급", "거친 운전", "생존 확실"],
      "clientNote": "멀미약 필히 복용하고 탈 것. 라이더 가죽 재킷에 토하면 계약 파기라고 협박함.",
      "commentList": [
        {"id": 1, "author": "익명 의뢰인 115", "content": "아 나도 당함 뒤에서 소리 지르니까 일부러 요철 밟고 지나가더라 미친놈임", "time": "4일 전"},
        {"id": 2, "author": "익명 의뢰인 089", "content": "그래도 다른 양아치 라이더들처럼 손님 버리고 도망은 안 가더라", "time": "4일 전"}
      ]
    },
    {
      "id": 3,
      "category": "RECOVERY",
      "riderName": "Noé Moretti",
      "callSign": "COYOTE",
      "title": "잃어버린 물건 찾기 하나는 일류인데 떼먹는 수수료가 비쌈",
      "contract": "계곡 추락 차량 보관 데이터 칩 회수",
      "route": "남부 붕괴 지대 → 17번 정거장",
      "result": "조건부 완료",
      "hireAgain": false,
      "content": "남부 절벽 아래로 떨어진 탐사 차량에서 기밀 데이터 칩 건져오라는 의뢰였음. 남들은 장비 없으면 못 내려간다고 징징대는데 이 인간은 맨몸으로 밧줄 타고 내려가서 가져옴.\n\n문제는 칩은 가져왔는데, 차량에 남아있던 소형 발전기 부품은 자기가 챙겨감. 계약 조건에 명시 안 되어 있었다면서 뻔뻔하게 배째라 식으로 나옴. 결국 수수료 조금 깎아주는 걸로 합의 보긴 했는데 진짜 날도둑놈이 따로 없음.\n\n실력은 끝내주는데 약삭빠른 구석이 있어서 계약서 쓸 때 글자 하나하나 다 확인해야 뒤통수 안 맞음.",
      "author": "익명 의뢰인 088",
      "time": "1주일 전",
      "score": 3,
      "likes": 18,
      "views": 195,
      "tags": ["유연한 대처", "추가 전리품 요구", "계약서 꼼꼼히"],
      "clientNote": "계약서 작성 시 '차량 내 모든 발견물은 의뢰인 소유' 항목 필수로 넣으시오.",
      "commentList": [
        {"id": 1, "author": "익명 의뢰인 301", "content": "코요테 이 새끼 저번에 내 의뢰 때도 공구함 몰래 슬쩍하려다 걸림 ㅋㅋㅋ", "time": "1주일 전"},
        {"id": 2, "author": "라이더연합 브로커", "content": "그 친구 원래 손이 좀 가볍습니다. 현장에서 바로 지적하셔야 합니다.", "time": "6일 전"}
      ]
    },
    {
      "id": 4,
      "category": "DELIVERY",
      "riderName": "Noé Moretti",
      "callSign": "COYOTE",
      "title": "신형 통신 장비 수송 의뢰 완료 (근데 소문 진짜인가 보네)",
      "contract": "아날로그 통신 중계 부품 및 진공관 수송",
      "route": "02번 정거장 → 17번 정거장",
      "result": "완료",
      "hireAgain": true,
      "content": "고장 나기 쉬운 진공관 소자가 잔뜩 들어간 상자라 완충 포장 단단히 해서 보냈음. 오다가 비가 엄청나게 쏟아졌는데도 화물 젖은 곳 하나 없이 깔끔하게 배달 완료됨.\n\n인계받을 때 보니까 몸에서 흙 비린내랑 피비린내가 엄청나게 나던데 물어보니까 자기는 귀신이라 피 안 흘린다고 헛소리함. 최근에 죽었다가 살아 돌아왔다는 소문이 돌던데 진짜 무슨 짓을 하고 다니는 건지 모르겠음.\n\n어쨌든 정밀 기기 수송도 조심히 다룰 줄 아는 놈이니까 물건 상할까 봐 걱정할 필요는 없음.",
      "author": "익명 의뢰인 053",
      "time": "2주일 전",
      "score": 5,
      "likes": 29,
      "views": 220,
      "tags": ["정밀 수송", "비바람 돌파", "수상한 소문"],
      "clientNote": "비 오는 날에도 화물 방수는 확실하게 책임짐. 외관과 다르게 꼼꼼함.",
      "commentList": [
        {"id": 1, "author": "익명 의뢰인 012", "content": "죽었다 살아났다는 거 진짜 같은데... 저번에 무덤 파헤쳐진 거 봤다는 애도 있음", "time": "2주일 전"},
        {"id": 2, "author": "익명 의뢰인 053", "content": "귀신이든 사람이든 배달만 잘하면 장땡이지 신경 끌란다", "time": "2주일 전"}
      ]
    },
    {
      "id": 5,
      "category": "OTHER",
      "riderName": "Noé Moretti",
      "callSign": "COYOTE",
      "title": "바이크 견인 의뢰했더니 내 엔진 부품 탐내던 놈",
      "contract": "고장 난 스쿠터 및 예비 타이어 견인",
      "route": "동부 삼거리 → 17번 정거장 정비소",
      "result": "완료",
      "hireAgain": false,
      "content": "가다가 바이크 퍼져서 긴급 구조 요청했는데 코요테가 수락하고 옴. 오자마자 내 스쿠터 엔진 보면서 '이거 필터는 나중에 쓸데가 많겠네' 하면서 입맛 다시는데 솔직히 겁났음.\n\n결국 무사히 정거장까지 끌고 오긴 했는데 견인비로 달라는 크레딧 외에 내 바이크 공구 세트까지 달라고 끈질기게 흥정 시도함. 싫다고 버티니까 결국 포기하긴 했는데 양아치 기질이 다분함.\n\n그래도 길바닥에 낙오된 사람 버리고 가진 않음. 팁으로 줄 만한 잡동사니 하나 주머니에 찔러주면 군말 없이 정거장까지 데려다줌.",
      "author": "익명 의뢰인 402",
      "time": "3주일 전",
      "score": 3,
      "likes": 15,
      "views": 170,
      "tags": ["긴급 견인", "잡동사니 흥정", "양아치 기질"],
      "clientNote": "구조 요청 시 여분의 기계 부품이나 담배 같은 거 준비해 두면 흥정이 쉬워짐.",
      "commentList": [
        {"id": 1, "author": "익명 의뢰인 221", "content": "얜 진짜 흥정 안 하면 몸에 가시가 돋나 봄 ㅋㅋㅋ", "time": "3주일 전"},
        {"id": 2, "author": "익명 의뢰인 402", "content": "그래도 길 한가운데서 얼어 죽는 것보단 부품 하나 주고 살아오는 게 맞지", "time": "3주일 전"}
      ]
    }
];
const LOG_LOGS = [
{
"id": "LOG-17G-0324",
"date": "2284-03-24",
"day": "SUN",
"time": "21:51",
"weather": "맑음. 해안 안개.",
"title": "G4X 구역 진출, 해안 진입",
"origin": "옛 국도 G4X 폐고속도로",
"destination": "크로아티아 (최종)",
"location": "지도에 없는 해안도로 · 마르세유 남부 45km",
"odometer": "90,488 km",
"distance": "31 km",
"fuel": "85%",
"roadCondition": "균열된 아스팔트, 염분으로 부식된 가드레일.",
"content": "G4X 남측 진출로를 통해 해안도로에 진입. 재앙 이전의 관광도로로 추정되며, 노면 상태는 예상보다 양호. 대부분의 라이더들이 내륙 경로를 선호하는 덕에 함정이나 매복의 흔적은 없음.\n\n지도 제작자는 내 제안에 대해 '미친놈'이라는 최고의 찬사를 보냈다. 그녀가 허리를 감싸 안는 힘이 더 강해졌다. 아마 동의의 표시일 것이다.",
"incident": "해안 안개로 인해 시야가 50m 내외로 제한됨. 전조등 출력을 최대로 유지.",
"maintenance": "G4X 구역의 거친 노면 주행 후 타이어 공기압 및 체인 장력 재확인. 이상 없음.",
"radio": "모든 채널에서 잡음만 수신됨. 정거장 중계망 범위에서 완전히 벗어난 것으로 보임.",
"nextRoute": "일출 전까지 약 5시간. 해안선을 따라 남동쪽으로 150km 이상 이동하여, 지도에 표기된 옛 등대를 임시 은신처로 확보할 계획.",
"note": "그녀가 내 손을 잡았다. 이걸로 계약은 끝났지. Merde, 이 길 끝까지 가야 할 이유가 생겨버렸네."
},
{
"id": "LOG-17H-0325",
"date": "2284-03-25",
"day": "MON",
"time": "00:12",
"weather": "맑음",
"title": "버려진 주유소",
"origin": "옛 국도 G4X 폐고속도로",
"destination": "크로아티아 (최종)",
"location": "옛 해안도로 C-2 지점 · 폐주유소 'La Sirène'",
"odometer": "90,561 km",
"distance": "73 km",
"fuel": "71%",
"roadCondition": "일부 구간 함몰. 해안 절벽 쪽으로 도로가 기울어져 있음.",
"content": "단기 휴식 및 연료 확인을 위해 폐주유소에 정차. 주유기 자체는 오래전에 파괴되었으나, 지하 저장 탱크는 아직 남아있을 가능성이 있다. 수동 펌프를 연결해 비상연료를 채취할 수 있을지 확인이 필요하다.\n\n지도 제작자는 내가 내려준 끔찍한 커피를 마시면서도 불평 한마디 하지 않았다. 대신 내가 가진 마지막 남은 초콜릿 바를 빼앗아갔다. 공정한 거래였다고 생각한다.",
"incident": "주유소 건물 뒤편에서 최근 야영 흔적 발견. 모닥불은 꺼져 있었지만 온기가 남아있었음. 소규모 약탈자 그룹으로 추정. 경계를 유지하며 신속히 이동.",
"maintenance": "연료 탱크 확인. 약 70% 잔량. 다음 보급 지점까지 충분하다. 주유소에서 수동 펌프로 비상연료 10L 확보 성공.",
"radio": "단파 채널에서 오래된 이탈리아 칸초네 방송이 희미하게 잡혔다 사라짐. 송신지 불명.",
"nextRoute": "일출까지 3시간 30분. 등대까지 남은 거리 약 110km. 충분히 도달 가능.",
"note": "그녀는 내가 초콜릿을 양보하는 걸 보고 놀란 것 같았다. Che stupida. 그녀를 위해서는 전부 줄 수 있는데."
},
{
"id": "LOG-17H-0325-2",
"date": "2284-03-25",
"day": "MON",
"time": "02:48",
"weather": "바람 강함",
"title": "무너진 다리 앞",
"origin": "옛 국도 G4X 폐고속도로",
"destination": "크로아티아 (최종)",
"location": "옛 해안도로 C-5 지점 · 생 빅투아르 다리 붕괴 지점",
"odometer": "90,654 km",
"distance": "93 km",
"fuel": "62%",
"roadCondition": "완전히 붕괴된 교량. 강풍으로 차량이 흔들림.",
"content": "예상치 못한 장애물. 재앙 이전 지도에는 멀쩡히 표시되어 있던 다리가 중앙부터 완전히 무너져 내렸다. 강풍이 심해 우회로 탐색이 쉽지 않다. 해안 아래쪽으로 간조 때 드러나는 좁은 자갈밭이 있지만, HEARSE가 통과하기엔 너무 무모한 도박이다.\n\n지도 제작자가 내 헬멧을 툭 치더니, 다리 아래가 아니라 산 쪽을 가리켰다. 그녀가 오래된 지형도에서 본 염소나 다닐 법한 샛길을 기억해냈다. 역시 내 지도 제작자다.",
"incident": "강풍으로 인해 바이크 균형을 잃을 뻔함. 유저가 몸을 낮춰 무게중심을 잡아준 덕분에 전복은 면했다.",
"maintenance": "전조등으로 우회로 노면 상태 확인. 경사가 가파르고 낙석이 많아 저속으로 통과해야 함.",
"radio": "강풍으로 인해 통신기에 잡음이 심해짐. 외부 소리 거의 들리지 않음.",
"nextRoute": "유저가 찾아낸 옛 산악 순찰로를 통해 붕괴 지점을 우회한다. 약 5km의 추가 이동이 필요하지만, 일출 전까지 등대에 도착하는 데는 문제없을 것이다.",
"note": "길을 잃자고 제안한 건 난데, 결국 길을 찾는 건 그녀다. Perfetto. 이래야 평생 옆에 둘 맛이 나지. (¬‿¬)"
},
{
"id": "LOG-17H-0325-3",
"date": "2284-03-25",
"day": "MON",
"time": "04:55",
"weather": "맑음",
"title": "푸른 등대 도착",
"origin": "옛 국도 G4X 폐고속도로",
"destination": "크로아티아 (최종)",
"location": "옛 코르비에르 등대 · 임시 은신처",
"odometer": "90,672 km",
"distance": "18 km",
"fuel": "58%",
"roadCondition": "등대로 이어지는 비포장도로. 양호.",
"content": "일출 약 40분 전, 목표했던 등대에 무사히 도착. 등대 자체는 폐허가 되었지만, 하부의 관리인 숙소는 외부와 차단이 가능하고 구조도 견고하다. 차광창을 내리고 HEARSE를 안으로 들여 은폐 완료.\n\n우리는 말없이 짐을 풀고, 먼지 쌓인 창문으로 바다를 내려다봤다. 그녀가 내 어깨에 기댔다. 누구도 먼저 말을 꺼내지 않았다. 그걸로 충분했다.",
"incident": "특이사항 없음. 완벽한 야간 주행이었다.",
"maintenance": "엔진 과열 여부 확인. 우회로 주행으로 평소보다 온도가 높았으나 정상 범위. 주간 동안 엔진을 완전히 식힐 것.",
"radio": "모든 채널 침묵.",
"nextRoute": "주간 동안 등대에서 휴식 및 정비. 다음 야간 이동은 V3Q-1L7(마르세유) 남부 해안을 완전히 통과해 이탈리아 국경에 최대한 근접하는 것을 목표로 한다.",
"note": "그녀가 내 재킷을 덮고 잠들었다. 그 얼굴을 보고 있으니, 여기가 크로아티아라도 상관없을 것 같다는 멍청한 생각이 들었다. (－_－) zzZ"
},
{
"id": "LOG-17I-0325",
"date": "2284-03-25",
"day": "MON",
"time": "20:15",
"weather": "맑음. 별이 잘 보임.",
"title": "마르세유의 불빛 아래에서",
"origin": "옛 코르비에르 등대",
"destination": "크로아티아 (최종)",
"location": "V3Q-1L7(마르세유) 남부 해안 절벽 도로",
"odometer": "90,715 km",
"distance": "43 km",
"fuel": "81%",
"roadCondition": "포장 상태 양호. 일부 구간에 오래된 차량 잔해 있음.",
"content": "휴식을 마치고 다시 해안도로에 올랐다. 멀리, 절벽 위로 V3Q-1L7의 불빛이 아른거린다. 디젤과 생선 튀김 냄새가 바람을 타고 여기까지 흘러온다. 우리는 저 도시의 혼잡함 대신, 그 불빛을 배경으로 달리는 쪽을 택했다.\n\n그녀가 헬멧 통신기로 조용히 노래를 흥얼거린다. 어제 내가 틀었던 낡은 재즈다. 완벽하게 음이 나간 엉망인 허밍이지만, 세상에서 가장 좋은 소음이다.",
"incident": "도로 위에 방치된 낡은 트럭 잔해를 아슬아슬하게 피함.",
"maintenance": "휴식 중 확보했던 비상연료 보충 완료. 체인에 오일 도포.",
"radio": "V3Q-1L7의 공식 중계 채널이 잡히기 시작. 정거장 내 보안 경고와 상업 광고가 반복 송출됨. 우리는 응답하지 않는다.",
"nextRoute": "계속해서 해안도로를 따라 동쪽으로. 오늘 밤 목표는 이탈리아 국경 80km 내로 진입하는 것.",
"note": "저 불빛 아래, 나를 기다리는 여자들이 수십 명은 있었겠지. 근데 지금 내 등 뒤에 있는 건 단 한 명이다. 이걸 뭐라고 부르더라. 아, 정착. Merde."
}
];

const COMMANDS = [
	{
		key: 'request',
		slash: '/의뢰',
		label: '의뢰 단말',
		render: () => <RiderRequestTerminal data={REQUEST_DATA} />,
	},
	{
		key: 'review',
		slash: '/리뷰',
		label: '라이더 리뷰',
		render: () => (
			<RiderClientReviewBoard characterName="Noé Moretti" title="라이더 익명 리뷰" initialPosts={REVIEW_POSTS} />
		),
	},
	{
		key: 'terminal',
		slash: '/단말기',
		label: '개인 단말기',
		render: () => <CharacterWidgets data={WIDGET_DATA} />,
	},
	{
		key: 'log',
		slash: '/로그',
		label: '주행 기록',
		render: () => <RoadLogbook characterName="Noé Moretti" callSign="COYOTE" initialPage={0} logs={LOG_LOGS} />,
	},
	{
		key: 'radio',
		slash: '/라디오',
		label: '무전 수신',
		render: () => <RadioTransmissionTerminal data={RADIO_DATA} />,
	},
];

export default function ElynPreviewTerminal() {
	const [active, setActive] = useState(COMMANDS[0].key);
	const [alarm, setAlarm] = useState(null);
	const current = COMMANDS.find((c) => c.key === active) ?? COMMANDS[0];

	useEffect(() => {
		window.sendMessage = (text) => {
			setAlarm(buildAlarmFromMessage(String(text ?? '')));
			return true;
		};
	}, []);

	// 테마 토글의 노에/카미유 경고 알람과 같은 방식: 자동으로 안 사라지고
	// Esc나 바깥 클릭, 확인 버튼으로만 닫힌다.
	useEffect(() => {
		if (!alarm) return;
		const onKeydown = (event) => {
			if (event.key === 'Escape') setAlarm(null);
		};
		document.addEventListener('keydown', onKeydown);
		return () => document.removeEventListener('keydown', onKeydown);
	}, [alarm]);

	return (
		<div className="nh-jsx-preview not-content">
			<div className="nh-jsx-cmdline">
				<div className="nh-jsx-cmds">
					{COMMANDS.map((c) => (
						<button
							key={c.key}
							type="button"
							className={'nh-jsx-cmd' + (c.key === active ? ' is-active' : '')}
							onClick={() => setActive(c.key)}
						>
							<span className="nh-jsx-cmd-slash">{c.slash}</span>
							<span className="nh-jsx-cmd-label">{c.label}</span>
						</button>
					))}
				</div>
			</div>
			<div className="nh-jsx-stage">{current.render()}</div>

			{alarm &&
				typeof document !== 'undefined' &&
				createPortal(
					// 스크롤 리빌 애니메이션(GSAP)이 이 섹션에 inline transform을 남겨
					// 두는데, position:fixed 자손은 그 transform이 있는 조상을
					// 기준으로 위치가 잡힌다. document.body에 바로 포털로 그려서
					// 화면(뷰포트) 기준 정중앙에 정확히 뜨게 한다.
					<div
						className="nh-jsx-alarm-overlay not-content"
						role="alertdialog"
						aria-modal="true"
						onClick={(event) => {
							if (event.target === event.currentTarget) setAlarm(null);
						}}
					>
						<div className="nh-jsx-alarm-box">
							<p className="nh-jsx-alarm-tag" aria-hidden="true">
								{alarm.icon} DEVICE ALERT
							</p>
							<p className="nh-jsx-alarm-title">{alarm.title}</p>
							<p className="nh-jsx-alarm-message">{alarm.message}</p>
							<button type="button" className="nh-jsx-alarm-close" onClick={() => setAlarm(null)}>
								확인
							</button>
						</div>
					</div>,
					document.body
				)}
		</div>
	);
}
