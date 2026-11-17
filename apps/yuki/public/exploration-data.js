export const campusSites=[
 {id:'dorm',name:'은행학사',x:286,y:13,w:72,h:34,kind:'building',color:'#ab9b77',roof:'#657667',text:'은행학사다! 기본은 2인 1실. 새벽 1시부터 5시까지는 출입할 수 없다.'},
 {id:'science',name:'자연과학관',x:35,y:51,w:66,h:37,kind:'building',color:'#a8b4a7',roof:'#5a7b78',text:'자연과학관이다! 인문관 뒤 언덕을 넘으면 나오는 이공계 구역. 아직 불이 켜진 연구실이 있다.'},
 {id:'engineering',name:'공학관',x:131,y:51,w:66,h:37,kind:'building',color:'#a2b4af',roof:'#5e7a82',text:'공학관이다! 새 건물이 많은 이공계 구역이다. 연구실의 밤은 조금 길어 보인다.'},
 {id:'admin',name:'본관',x:279,y:66,w:82,h:43,kind:'building',color:'#c9b58a',roof:'#68776b',text:'본관이다! 등록과 장학금은 대부분 온라인으로. 서류가 꼬였다면 번호표를 뽑자.'},
 {id:'auditorium',name:'대강당',x:412,y:16,w:70,h:34,kind:'building',color:'#b6b5a0',roof:'#758372',text:'대강당이다! 운동장과 농구장, 체육관도 캠퍼스 뒤편에 모여 있다.'},
 {id:'sports',name:'운동장·체육관',x:519,y:15,w:91,h:67,kind:'sports',text:'운동장과 체육관이다! 야외 농구장도 이쪽. 강의실을 벗어난 학생들이 몸을 푼다.'},
 {id:'social',name:'사회과학관',x:40,y:119,w:70,h:37,kind:'building',color:'#b98a6d',roof:'#786757',text:'사회과학관이다! 중앙로 왼쪽의 오래된 벽돌 건물. 다음 강의실을 확인해 보자.'},
 {id:'humanities',name:'인문관',x:38,y:187,w:70,h:38,kind:'building',color:'#b88b6c',roof:'#776852',text:'인문관이다! 학교에서 가장 오래된 붉은 벽돌 건물들 중 하나. 언덕 너머로 이공계 구역이 이어진다.'},
 {id:'library',name:'중앙도서관',x:149,y:187,w:73,h:38,kind:'building',color:'#c29976',roof:'#706d5a',text:'중앙도서관이다! 다음 모험은 책장 사이에 있다. 빌린 책의 반납일도 잊지 말자.'},
 {id:'plaza',name:'느티광장',x:277,y:139,w:83,h:50,kind:'plaza',text:'느티광장이다! 오래된 느티나무와 시계 아래는 만남의 장소. 12월 첫째 주, 설야제의 불빛이 켜진다.'},
 {id:'hall',name:'학생회관',x:415,y:123,w:70,h:38,kind:'building',color:'#d2bd8b',roof:'#927650',action:'inn',text:'학생회관이다! 1층 노란창에는 핫초코와 푸딩이 있다. 3층 복도 끝, 여관의 문이 보인다.'},
 {id:'music',name:'음악관',x:527,y:113,w:69,h:38,kind:'building',color:'#baad9a',roof:'#7b7787',text:'음악관이다! 연습실의 소리가 조형관 복도까지 들려온다. 오늘도 누군가는 연습 중이다.'},
 {id:'art',name:'조형관',x:415,y:191,w:71,h:39,kind:'building',color:'#c4a184',roof:'#7e7464',text:'조형관이다! 1층 셔터문 옆 창가가 유우키의 자리다. 밤에 들어가려면 학생증이 필요하다.'},
 {id:'stage',name:'야외무대',x:531,y:183,w:65,h:32,kind:'stage',text:'야외무대다! 점심 공연과 축제가 열리는 곳. 겨울 설야제에는 여관의 던전 탈출 부스도 열린다.'},
 {id:'business',name:'경영관',x:359,y:245,w:65,h:33,kind:'building',color:'#a8c4bb',roof:'#637d7b',text:'경영관이다! 정문 바로 안쪽의 유리 외벽 건물. 오래된 벽돌 건물들 사이에서 빛난다.'},
 {id:'rear',name:'후문',x:595,y:237,w:31,h:27,kind:'gate',action:'rest',text:'후문이다! 조형관 뒤로 자취방 골목이 이어진다. 유우키의 방까지는 걸어서 5분이다.'},
 {id:'gate',name:'정문',x:285,y:263,w:65,h:22,kind:'gate',text:'정문이다! 은행나무 중앙로가 느티광장까지 이어진다. 가을에는 노란 잎뿐 아니라 발밑도 주의하자.'},
 {id:'medical',name:'의대·간호대·병원',x:458,y:310,w:95,h:23,kind:'medical',text:'큰길 건너편의 별도 부지다! 의대와 간호대, 대학병원은 횡단보도를 건너야 갈 수 있다.'},
];
export const innObjects=[
 {id:'books',name:'판타지 소설 책장',x:31,y:26,w:112,h:52,kind:'shelf',text:'선배들이 남긴 판타지 소설이다! 용사가 아직 서툴러도 괜찮은 이야기들이 꽂혀 있다.'},
 {id:'board',name:'화이트보드',x:213,y:18,w:165,h:55,kind:'board',text:'이번 달 세션 일정이 적혀 있다! 옆에는 지난 세션의 엉뚱한 명대사. 지우기는 아까워 보인다.'},
 {id:'games',name:'게임·룰북 선반',x:452,y:26,w:139,h:52,kind:'games',text:'보드게임, 룰북, 세션용 지도가 뒤섞여 있다! 한 달에 몇 번, 돌아가며 GM이 되어 모험을 연다.'},
 {id:'sofa',name:'낡은 소파',x:36,y:131,w:121,h:63,kind:'sofa',text:'낡았지만 편안한 소파다! 소설을 읽어도, 과제를 해도, 아무것도 안 해도 괜찮다.'},
 {id:'blanket',name:'담요',x:95,y:145,w:40,h:33,kind:'blanket',text:'누군가 두고 간 담요다! 모험가도 수업이 끝나면 쉬어야 한다.'},
 {id:'table',name:'긴 테이블',x:239,y:121,w:161,h:72,kind:'table',text:'긴 테이블이다! 세션이 없는 날엔 보드게임이나 세계관 이야기로 밤이 늦어진다.'},
 {id:'guestbook',name:'숙박부',x:254,y:131,w:33,h:25,kind:'book',text:'숙박부를 발견했다! 사실은 출석부다. 회장은 주인장, 신입은 투숙객. 다들 반쯤은 진심이다.'},
 {id:'map',name:'세션 지도',x:301,y:145,w:44,h:29,kind:'map',text:'아직 끝나지 않은 캠페인의 지도다! 모험이 길어지면 다음 학기에도 이어갈 수 있다.'},
 {id:'dice',name:'주사위 통',x:359,y:128,w:29,h:30,kind:'dice',text:'주사위 통이다! 설야제에는 이 주사위로 던전을 탈출한다. 고백 판정까지 대신해 주지는 않는다.'},
 {id:'kettle',name:'전기포트·간식',x:492,y:132,w:106,h:59,kind:'snacks',text:'전기포트와 컵라면, 과자다! 긴 세션의 보급품. 누가 두었는지는 몰라도 고맙다.'},
 {id:'miniature',name:'작은 동물 모형',x:79,y:236,w:37,h:29,kind:'miniature',text:'작은 동물 모형이다! 세션에서 마음에 남으면, 유우키가 다음 모임에 모형으로 가져오곤 한다.'},
 {id:'zine',name:'동아리 회지',x:447,y:235,w:40,h:27,kind:'zine',text:'학기 말에 모아 만든 회지다! 짧은 소설과 세계관, 그림이 한데 묶여 있다. 취향을 비웃는 사람은 없다.'},
 {id:'seungmin',name:'유승민',x:425,y:155,w:24,h:32,kind:'npc',action:'npc-talk',text:'책상 옆에 서 있던 승민이 나른한 눈을 들어 올렸다.'},
 {id:'exit',name:'복도 쪽 문',x:290,y:278,w:63,h:29,kind:'door',action:'campus',text:'손으로 그린 여관 간판이 걸린 문이다! 바깥은 학생회관 3층 복도. 다시 캠퍼스로 나갈까?'},
];

// Shared by the painted paths and navigation, so the hero stays on the roads.
export const campusRoadNodes={
 gate:{x:320,y:278},spine:{x:320,y:244},plaza:{x:320,y:204},
 loopSW:{x:270,y:204},loopW:{x:270,y:178},loopNW:{x:270,y:128},loopN:{x:320,y:128},loopNE:{x:370,y:128},loopE:{x:370,y:178},loopSE:{x:370,y:204},
 admin:{x:320,y:120},dormTurn:{x:370,y:56},dorm:{x:328,y:56},
 west:{x:240,y:178},westUpper:{x:240,y:104},engineering:{x:164,y:104},science:{x:68,y:104},social:{x:80,y:178},westLower:{x:240,y:244},library:{x:184,y:244},humanities:{x:80,y:244},
 hall:{x:450,y:178},eastUpper:{x:450,y:104},auditorium:{x:450,y:64},sportsTurn:{x:560,y:104},sports:{x:560,y:96},music:{x:560,y:164},east:{x:560,y:178},stage:{x:560,y:228},eastLower:{x:560,y:244},rear:{x:610,y:244},art:{x:450,y:244},businessTurn:{x:450,y:284},business:{x:392,y:284},crossing:{x:320,y:306},medical:{x:504,y:306},
};
export const campusRoadEdges=[
 ['gate','spine'],['spine','plaza'],['plaza','loopSW'],['loopSW','loopW'],['loopW','loopNW'],['loopNW','loopN'],['loopN','loopNE'],['loopNE','loopE'],['loopE','loopSE'],['loopSE','plaza'],['loopN','admin'],['loopNE','dormTurn'],['dormTurn','dorm'],
 ['loopW','west'],['west','westUpper'],['westUpper','engineering'],['engineering','science'],['west','social'],['west','westLower'],['westLower','library'],['library','humanities'],['westLower','spine'],
 ['loopE','hall'],['hall','eastUpper'],['eastUpper','auditorium'],['eastUpper','sportsTurn'],['sportsTurn','sports'],['sportsTurn','music'],['music','east'],['east','hall'],['east','stage'],['stage','eastLower'],['eastLower','rear'],['eastLower','art'],['art','hall'],['art','businessTurn'],['businessTurn','business'],['gate','crossing'],['crossing','medical'],
];

export const seungminLines=[
 '……아, 유휘 왔나.',
 '영혼이 털린 얼굴인데. 또 혼자 머릿속에서 마왕성 들어가다가 파티원 전멸이라도 시켰나.',
 '또 그 짓 했제. 짝사랑하는 사람 지나가는 길목에 몰래 숨겨 두는 수호천사 놀이.',
 '이번엔 전방에 서라. 빵 들고 설치는 수달처럼 방패라도 하나 쥐여줄 테니까. 억울하면 주사위 잘 굴리가 크리티컬 띄우든가.',
];

export const roomObjects=[
 {id:'workbench',name:'미니어처 작업대',x:40,y:85,w:130,h:48,kind:'desk',text:'창가의 작업대다! 확대경과 작은 도구가 칸칸이 정리되어 있다. 여기서는 손재주 판정에 자신이 있다.'},
 {id:'drawer',name:'책상 서랍',x:184,y:90,w:42,h:43,kind:'drawer',text:'파스와 손목 보호대를 발견했다! 형이 보낸 회복 아이템. 아직 포장도 뜯지 않았다.'},
 {id:'fridge',name:'냉장고',x:40,y:191,w:42,h:60,kind:'fridge',text:'엄마의 반찬과 편의점 푸딩이 들어 있다! 식사와 디저트의 보급은 안정적이다.'},
 {id:'oven',name:'작은 전기 오븐',x:105,y:201,w:48,h:39,kind:'oven',text:'작은 동물과 빵을 굽는 오븐이다! 단, 점토로 만든 빵이다. 먹으면 안 된다.'},
 {id:'kitchen',name:'인덕션·세탁기',x:179,y:193,w:77,h:48,kind:'kitchen',text:'빌트인 생활 장비다! 세탁기는 성실하게 일한다. 인덕션은 아직 출격 대기 중이다.'},
 {id:'sofa',name:'소파',x:267,y:104,w:92,h:48,kind:'sofa',text:'정갈한 소파다! 작업실의 흙먼지는 이곳까지 데려오지 않는다. 잠깐 쉬어 갈까?'},
 {id:'books',name:'판타지 소설',x:279,y:27,w:72,h:48,kind:'books',text:'성장하는 용사들의 이야기다! 여관에서 빌린 책은 맨 앞 칸에 따로 모여 있다. 반납 퀘스트를 잊지 말자.'},
 {id:'bath',name:'욕실',x:284,y:211,w:66,h:52,kind:'bath',text:'작은 욕실이다! 손에 남은 점토를 씻어 냈다. 오늘의 작업은 여기까지.'},
 {id:'bed',name:'복층 매트리스',x:438,y:40,w:119,h:55,kind:'bed',text:'복층의 잠자리다! 매트리스 길이가 조금 모자라 발끝이 걸린다. 천장이 낮으니 머리도 조심하자.'},
 {id:'cushion',name:'천장 모서리 쿠션',x:579,y:44,w:31,h:31,kind:'cushion',text:'직접 만든 작은 쿠션이다! 머리 충돌 피해를 줄여 준다. 설치 전의 피해 기록은 묻지 말자.'},
 {id:'diary',name:'꿈 일기',x:439,y:131,w:36,h:26,kind:'diary',text:'머리맡의 꿈 일기다! 표지를 만지려는 순간 주인이 다급하게 막아섰다. 열람 권한이 없다.'},
 {id:'tin',name:'버터쿠키 틴케이스',x:523,y:131,w:43,h:27,kind:'tin',text:'첫 칸에 서툰 작은 동물이 있다! 중학생 때 누군가를 닮게 빚은 것. 이것만은 한 번도 다시 만들지 않았다.'},
 {id:'shoes',name:'가지런한 신발',x:443,y:249,w:43,h:25,kind:'shoes',text:'신발 코가 바깥쪽을 향하고 있다! 실내화로 갈아 신자. 분리수거도 철저한 집이다.'},
 {id:'exit',name:'현관 도어락',x:541,y:272,w:67,h:30,kind:'door',action:'world',text:'현관이다! 도어락을 확인했다. 다시 바깥의 모험으로 나갈까?'},
];
