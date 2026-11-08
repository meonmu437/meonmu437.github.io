export const ELEMENTS = [
	{ id: 'pungbaek', name: '풍백', hanja: '風伯', trait: '바람', desc: '흩어버리고 몰아내는 기운' },
	{ id: 'usa', name: '우사', hanja: '雨師', trait: '비', desc: '씻어내고 가라앉히는 기운' },
	{ id: 'unsa', name: '운사', hanja: '雲師', trait: '구름', desc: '가리고 숨기는 기운' },
	{ id: 'naegong', name: '뇌공', hanja: '雷公', trait: '천둥과 벼락', desc: '끊어내고 내리치는 기운' },
	{ id: 'seoribal', name: '서릿발', hanja: '霜', trait: '서리', desc: '얼려서 붙들고 멈추는 기운' },
	{ id: 'bulkkot', name: '불꽃', hanja: '火', trait: '불', desc: '태워서 정화하는 기운' },
	{ id: 'byeot', name: '볕', hanja: '日', trait: '햇볕', desc: '데우고 길러내는 기운' },
	{ id: 'dalbit', name: '달빛', hanja: '月', trait: '밤과 환영', desc: '비춰서 드러내는 기운' },
	{ id: 'jisin', name: '지신', hanja: '地神', trait: '땅', desc: '버티고 붙잡는 기운' },
];

export const SPIRITS = [
	{ id: 'dongja', name: '동자', hanja: '童子', desc: '어린 영. 천진하고 변덕스러우며 장난이 심함' },
	{ id: 'agissi', name: '아기씨', hanja: '', desc: '어린 여아 영. 여리고 예민하지만 고집이 셈' },
	{ id: 'janggun', name: '장군', hanja: '將軍', desc: '무장 신령. 위엄과 살기, 제압에 강함' },
	{ id: 'sinjang', name: '신장', hanja: '神將', desc: '오방(五方)을 지키는 수호 장수. 한 곳을 틀어막음' },
	{ id: 'daegam', name: '대감', hanja: '大監', desc: '재물과 터를 맡은 벼슬 신. 대가를 따지고 흥정함' },
	{ id: 'sansin', name: '산신', hanja: '山神', desc: '산을 다스리는 어른. 터와 길을 내어주거나 거둠' },
	{ id: 'yongwang', name: '용왕', hanja: '龍王', incompatibleElements: ['bulkkot', 'jisin'], desc: '물의 신. 변덕이 크고 베풂도 큼' },
	{ id: 'chilseong', name: '칠성', hanja: '七星', desc: '별과 수명의 신. 운수와 명줄을 셈함' },
	{ id: 'seonnyeo', name: '선녀', hanja: '仙女', desc: '맑고 신비로운 여신. 정화와 치유' },
	{ id: 'halmi', name: '할미', hanja: '', desc: '대신할머니. 말은 느리지만 한번 정하면 물리지 않음' },
	{ id: 'cheongryong', name: '청룡', hanja: '靑龍', desc: '동방을 지키는 푸른 용. 흐름과 생기를 다스리며 막힌 기운을 풀고 길을 엶' },
	{ id: 'baekho', name: '백호', hanja: '白虎', incompatibleElements: ['bulkkot'], desc: '서방을 지키는 흰 호랑이. 위엄과 제압으로 잡귀를 몰아냄' },
	{ id: 'jujak', name: '주작', hanja: '朱雀', incompatibleElements: ['usa', 'seoribal'], desc: '남방을 지키는 붉은 새. 불과 정화로 탁한 기운과 살을 태움' },
	{ id: 'hyeonmu', name: '현무', hanja: '玄武', incompatibleElements: ['bulkkot', 'jisin'], desc: '북방을 지키는 거북과 뱀의 신수. 수호와 봉인으로 사람을 지키고 귀신을 붙듦' },
	{ id: 'wolha', name: '월하노인', hanja: '月下老人', incompatibleElements: ['byeot'], desc: '붉은 실로 인연을 맺는 신. 사람 사이의 연과 얽힌 매듭을 살핌' },
];

export const TOOLS = [
	{ id: 'body', name: '육신', label: '사용자의 몸 (육신)', desc: '별도 도구 없이 사용자 자신의 몸에 신력을 실어 맨손과 발로 귀신을 제압하는 물리 퇴마' },
	{ id: 'sinkal', name: '신칼', desc: '짧은 쌍칼. 잡귀를 쳐내고 길을 가름' },
	{ id: 'bangul', name: '방울', desc: '흔들어 신을 부르고 기운을 깨움' },
	{ id: 'buchae', name: '부채', desc: '바람을 일으키고 기운을 쓸어냄' },
	{ id: 'samjichang', name: '삼지창', desc: '세 갈래 창. 찔러 고정하고 꿰뚫음' },
	{ id: 'woldo', name: '월도', desc: '반달 날의 큰 칼. 쓸어서 베어냄' },
	{ id: 'jakdu', name: '작두', desc: '날 위에 올라서는 신통. 가르는 힘이 극단적' },
	{ id: 'myeongdu', name: '명두', desc: '거울. 비춰서 정체를 드러냄' },
	{ id: 'obanggi', name: '오방기', desc: '오색 깃발. 방위를 세워 영역을 만듦' },
	{ id: 'sinjangdae', name: '신장대', desc: '신이 내리는 대나무 가지. 떨림으로 뜻을 전함' },
	{ id: 'hwal', name: '활', desc: '멀리서 쏘아 쫓아냄' },
	{ id: 'bujeok', name: '부적', desc: '붙이고 봉하고 가둠' },
];
