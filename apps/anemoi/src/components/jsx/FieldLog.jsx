import { useState } from 'react';
import { CloudSun, Wind, Footprints, Search, Feather, ChevronLeft, ChevronRight } from 'lucide-react';

function FieldLog(props = {}) {
  const cn = (...classes) => classes.filter(Boolean).join(" ");

  const {
    characterName = "라파엘 에르덴",
    callSign = "황실의 사냥개",
    initialPage = 0,
    logs: rawLogs,
    records: legacyLogs
  } = props;

  const defaultLogs = [
    {
      date: "5월 22일",
      time: "06:42",
      weather: "옅은 안개 · 서늘함",
      temperature: "12°C",
      title: "북서 사냥길 새벽 기록",
      location: "에버우드 북서 수림 · 검은 샘 남쪽",
      windDirection: "서북서풍",
      windSpeed: "약 3 m/s",
      tracks:
        "큰 수사슴 발굽 자국 1열. 전날 밤의 것으로 추정. 오른쪽 뒷발 자국이 약간 깊고, 개울 직전에서 방향을 북쪽으로 틀었다.",
      findings:
        "낮은 참나무 가지에 검은 털 몇 가닥. 흙에 묻힌 황동 단추 1개. 가문 문장은 마모되어 식별 불가.",
      note:
        "흔적이 너무 곧다. 쫓기는 짐승은 이렇게 걷지 않는다. 누군가 길을 만들고 있는 쪽에 가깝다."
    },
    {
      date: "5월 22일",
      time: "11:18",
      weather: "맑음 · 건조",
      temperature: "18°C",
      title: "사냥터 경계석 인근",
      location: "에버우드 서부 경계 · 오래된 돌담",
      windDirection: "남서풍",
      windSpeed: "약 5 m/s",
      tracks:
        "사람 발자국 둘. 한 명은 승마 장화를 착용했고 다른 한 명은 밑창이 얇은 구두. 돌담을 넘은 뒤 흔적이 갈라진다.",
      findings:
        "부러진 화살대 1개. 황실 사냥대 규격과 길이가 다름. 화살깃은 회색, 촉 끝에 송진 흔적이 남아 있음.",
      note:
        "밀렵꾼이라면 지나치게 흔적을 많이 남겼다. 반대로 초보라면 이 숲의 경계석을 알 리가 없다."
    },
    {
      date: "5월 23일",
      time: "16:05",
      weather: "흐림 · 비 냄새",
      temperature: "15°C",
      title: "비 오기 전의 능선",
      location: "에버우드 북쪽 능선 · 사냥탑 동쪽",
      windDirection: "북풍",
      windSpeed: "약 7 m/s",
      tracks:
        "낙엽 위에 짧게 끊기는 혈흔. 양은 적고 일정하지 않다. 짐승이 아니라 사람이 손이나 팔을 다친 흔적으로 보임.",
      findings:
        "젖은 천 조각, 약초 냄새가 남은 작은 유리병, 최근 깎인 나뭇가지 세 개.",
      note:
        "비가 오면 전부 지워진다. 그래서 오히려 지금 움직이는 사람이 있을 것이다. 흔적이 사라지는 걸 기다리는 쪽이 있다."
    }
  ];

  const logList =
    Array.isArray(rawLogs) && rawLogs.length > 0
      ? rawLogs
      : Array.isArray(legacyLogs) && legacyLogs.length > 0
        ? legacyLogs
        : defaultLogs;

  const safeInitialPage =
    initialPage >= 0 && initialPage < logList.length
      ? initialPage
      : 0;

  const [currentPage, setCurrentPage] = useState(safeInitialPage);
  const currentLog = logList[currentPage];

  const handlePrev = () => {
    setCurrentPage((page) => Math.max(page - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((page) =>
      Math.min(page + 1, logList.length - 1)
    );
  };

  if (!currentLog) return null;

  const Ornament = ({ compact = false }) => (
    <div className={cn(
      "flex items-center justify-center gap-2 text-[#9c7c3f]",
      compact ? "my-1" : "my-2.5"
    )}>
      <span className={cn("h-px bg-[#b79b6c]", compact ? "w-12" : "w-20")} />
      <span className="text-[10px] leading-none">❧</span>
      <span className={cn("h-px bg-[#b79b6c]", compact ? "w-12" : "w-20")} />
    </div>
  );

  const StagArrowMark = () => (
    <svg viewBox="0 0 50 50" className="h-11 w-11 shrink-0" aria-hidden="true">
      <path
        d="M25 18c-3.3-3.1-4.9-6.3-5.3-10M21.2 13.3c-3.1-1.2-5.1-3.4-6.2-6.6M19.2 9.8c-2.4-.4-4.4-1.5-6-3.2M25 18c3.3-3.1 4.9-6.3 5.3-10M28.8 13.3c3.1-1.2 5.1-3.4 6.2-6.6M30.8 9.8c2.4-.4 4.4-1.5 6-3.2"
        fill="none"
        stroke="#f3ecd9"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18.3 19.5c1.8-2.5 4-3.7 6.7-3.7s4.9 1.2 6.7 3.7L30.1 31c-1 5.4-9.2 5.4-10.2 0Z"
        fill="#f3ecd9"
      />
      <path d="m19.3 22.5-5.5-2.8 3.9 6.2Z" fill="#f3ecd9" />
      <path d="m30.7 22.5 5.5-2.8-3.9 6.2Z" fill="#f3ecd9" />
      <path
        d="M12 38 38 14"
        stroke="#c9a563"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="m38 14-4.3.8 3.1 3.2Z" fill="#c9a563" />
    </svg>
  );

  const CompassMark = () => (
    <svg viewBox="0 0 50 50" className="h-11 w-11 shrink-0" aria-hidden="true">
      <circle cx="25" cy="25" r="15" fill="none" stroke="#f3ecd9" strokeWidth="1.4" />
      <path
        d="M25 6v6M25 38v6M6 25h6M38 25h6"
        stroke="#f3ecd9"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M25 14 29 25 25 36 21 25Z"
        fill="#c9a563"
        stroke="#8a6a3a"
        strokeWidth="1"
      />
    </svg>
  );

  const FieldRow = ({ icon: Icon, label, value }) => (
    <div className="grid grid-cols-[76px_minmax(0,1fr)] items-start gap-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[9px] font-black tracking-[0.08em] text-[#6e4f36]">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>

      <div className="break-words text-[13px] font-bold leading-relaxed text-[#2d2013]">
        {value || "기록 없음"}
      </div>
    </div>
  );

  const SectionBlock = ({
    icon: Icon,
    title,
    children,
    tone = "paper"
  }) => {
    if (tone === "note") {
      return (
        <div className="relative mx-1 my-1 rotate-[-0.6deg] rounded-[2px] border border-[#b79b6c] bg-[#ece0c4] px-3 py-3 shadow-[0_3px_8px_rgba(40,26,14,0.18)]">
          <span
            aria-hidden="true"
            className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-[#101c14] bg-[#8a6a3a] shadow-[0_1px_2px_rgba(40,26,14,0.3)]"
          />

          <div className="mb-1.5 flex items-center gap-2 text-[9px] font-black tracking-[0.11em] text-[#6e4f36]">
            <Icon className="h-4 w-4" />
            {title}
          </div>

          <div className="whitespace-pre-wrap break-words font-serif text-[13.5px] italic font-bold leading-relaxed text-[#3a2c1e]">
            {children || "기록 없음"}
          </div>
        </div>
      );
    }

    return (
      <section className="border-y border-[#c9b98f] px-1 py-2.5">
        <div className="mb-2 flex items-center gap-2 text-[9px] font-black tracking-[0.11em] text-[#6e4f36]">
          <Icon className="h-4 w-4" />
          {title}
        </div>

        <div className="whitespace-pre-wrap break-words text-[13px] font-bold leading-relaxed text-[#2d2013]">
          {children || "기록 없음"}
        </div>
      </section>
    );
  };

  return (
    <div className="relative w-full max-w-none select-none py-4">
      {/* 기록장 본체 */}
      <div
        className="
          relative z-10 overflow-hidden rounded-[6px]
          border border-[#16261c]
          px-4 pb-4 pt-4
          text-[#241e17]
          shadow-[0_14px_30px_rgba(40,26,14,0.32)]
        "
        style={{
          backgroundColor: "#f3ecd9",
          backgroundImage: `
            radial-gradient(circle at 14% 6%, rgba(255,250,235,0.5), transparent 22%)
          `
        }}
      >
        {/* 상단 제목부: 가죽 명패 */}
        <header className="text-center">
          <div className="relative rounded-[4px] border border-[#101c14] bg-[#24402c] px-3 pb-2.5 pt-3 shadow-[inset_0_1px_0_rgba(220,235,225,0.12),0_4px_10px_rgba(10,20,14,0.35)]">
            <div className="pointer-events-none absolute inset-[3px] rounded-[2px] border border-[#3f6b4a]/50" />

            <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-2">
              <div className="flex justify-start">
                <StagArrowMark />
              </div>

              <div className="min-w-0">
                <div className="text-[8px] font-black tracking-[0.22em] text-[#c9a563]">
                  EXPEDITION JOURNAL
                </div>
                <h1 className="mt-0.5 whitespace-normal break-words font-serif text-[18px] font-black leading-tight tracking-[-0.02em] text-[#f3ecd9]">
                  라파엘의 기록장
                </h1>
              </div>

              <div className="flex justify-end">
                <CompassMark />
              </div>
            </div>
          </div>

          <Ornament compact/>

          <div className="mx-auto flex max-w-[92%] flex-wrap items-center justify-center gap-x-2 gap-y-1 border-y border-[#b79b6c] bg-[#ece2c8] px-2 py-2 text-center text-[10px] font-bold text-[#4a3826]">
            <span>{currentLog.date}</span>
            <span className="text-[#9c7c3f]">·</span>
            <span>{currentLog.time}</span>
            <span className="text-[#9c7c3f]">·</span>
            <span className="min-w-0 whitespace-normal break-words">{currentLog.location}</span>
          </div>
        </header>

        {/* 기록 제목 */}
        <div className="mt-4 border-y border-[#16261c] bg-[#1c3323] px-3 py-3 text-center text-[#f3ecd9]">
          <div className="text-[8px] font-black tracking-[0.14em] text-[#c9a563]">
            FIELD OBSERVATION
          </div>

          <h2 className="mt-1 font-serif text-[16px] font-black leading-tight text-[#f3ecd9]">
            {currentLog.title || "제목 없는 기록"}
          </h2>
        </div>

        {/* 날씨 / 풍향 */}
        <div className="mt-3 grid grid-cols-2 gap-x-4 border-y border-[#c9b98f] bg-[#ece2c8]/55 px-2">
          <FieldRow
            icon={CloudSun}
            label="날씨"
            value={`${currentLog.weather || "미상"} · ${currentLog.temperature || "—"}`}
          />

          <FieldRow
            icon={Wind}
            label="풍향"
            value={`${currentLog.windDirection || "미상"} · ${currentLog.windSpeed || "—"}`}
          />
        </div>

        {/* 흔적 */}
        <div className="mt-3">
          <SectionBlock
            icon={Footprints}
            title="흔적"
          >
            {currentLog.tracks}
          </SectionBlock>
        </div>

        {/* 발견물 */}
        <div className="mt-3">
          <SectionBlock
            icon={Search}
            title="발견물"
          >
            {currentLog.findings}
          </SectionBlock>
        </div>

        {/* 라파엘 기록 */}
        <div className="mt-3">
          <SectionBlock
            icon={Feather}
            title="라파엘의 기록"
            tone="note"
          >
            “{currentLog.note || "남긴 기록 없음."}”
          </SectionBlock>
        </div>

        {/* 필기 서명 */}
        <div className="mt-4 mb-4 flex items-end justify-between gap-3 px-1">

          <div className="text-right">
            <div
              className="
                font-serif text-[13px] italic
                tracking-[0.02em] text-[#4a3826]
              "
            >
              Raphael Erden
            </div>
            <div className="mt-0.5 text-[8px] font-bold tracking-[0.08em] text-[#6e5b42]">
              {callSign}
            </div>
          </div>
        </div>
        {/* 페이지 이동 */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 0}
            aria-label="이전 야외 기록"
            className={cn(
              `
                flex h-9 items-center justify-center gap-1.5
                rounded-[3px] border border-[#1c3323]
                bg-[#2f4a34]
                px-3
                text-[9px] font-black uppercase tracking-[0.09em]
                text-[#f3ecd9]
                transition-all
                active:translate-y-0.5
              `,
              currentPage === 0 &&
                "cursor-not-allowed opacity-35"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            이전 장
          </button>

          <div className="flex items-center gap-1.5">
            {logList.map((_, index) => (
              <span
                key={index}
                className={cn(
                  "rounded-full border border-[#8a6a3a]",
                  index === currentPage
                    ? "h-2.5 w-6 bg-[#9c7c3f]"
                    : "h-2.5 w-2.5 bg-[#ece2c8]"
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === logList.length - 1}
            aria-label="다음 야외 기록"
            className={cn(
              `
                flex h-9 items-center justify-center gap-1.5
                rounded-[3px] border border-[#1c3323]
                bg-[#2f4a34]
                px-3
                text-[9px] font-black uppercase tracking-[0.09em]
                text-[#f3ecd9]
                transition-all
                active:translate-y-0.5
              `,
              currentPage === logList.length - 1 &&
                "cursor-not-allowed opacity-35"
            )}
          >
            다음 장
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* 하단 표기 */}
        <footer className="mt-3 border-t border-[#101c14] bg-[#16261c] px-3 py-2 text-center">
          <div className="text-[7.5px] font-black uppercase tracking-[0.15em] text-[#c9a563]">
            ERDEN HOUSE · EVERWOOD FIELD RECORD
          </div>
        </footer>
      </div>
    </div>
  );
}

export default FieldLog;
