import { useState } from 'react';

function RequestBoard(props = {}) {
  const cn = (...classes) => classes.filter(Boolean).join(" ");

  const source = Array.isArray(props.data)
    ? props.data[0] ?? {}
    : props;

  const {
    date = "5월 3일",
    office = "황실 사냥대 · 제2기록실",
    seal = "IMPERIAL HUNT",
    requests: rawRequests
  } = source;

  const requests =
    Array.isArray(rawRequests) && rawRequests.length > 0
      ? rawRequests.slice(0, 3)
      : [
          {
            id: "HNT-0427",
            title: "에버우드 북서 수림 이상 개체 추적",
            issuer: "에버우드 영지 관리관",
            target: "뿔에 흰 흉터가 있는 대형 수사슴",
            lastSeen: "에버우드 북서 사냥길 · 검은 샘 인근",
            reward: "금화 80",
            risk: "MEDIUM",
            status: "OPEN",
            memo:
              "평범한 사냥감으로 보이나 최근 세 차례 추적견을 따돌렸다. 생포 우선, 불가피한 경우에만 사살 허가."
          },
          {
            id: "HNT-0428",
            title: "황도 외곽 밀렵단 흔적 확인",
            issuer: "황실 산림감찰관",
            target: "불법 덫 설치자 및 밀렵단",
            lastSeen: "황도 서문 밖 왕실 보호림 제4구역",
            reward: "금화 140",
            risk: "HIGH",
            status: "OPEN",
            memo:
              "귀족가 문장이 지워진 화살촉이 발견되었다. 교전보다 신원 확인과 증거 확보를 우선할 것."
          },
          {
            id: "HNT-0429",
            title: "북부 사냥 별장 실종인 수색",
            issuer: "황실 시종국",
            target: "황실 시종 1명",
            lastSeen: "북부 사냥 별장 동쪽 설원 경계",
            reward: "금화 210",
            risk: "SEVERE",
            status: "OPEN",
            memo:
              "폭설 직전 마지막으로 목격되었다. 대상은 황실 문서 가방을 휴대 중이며 문서 회수 또한 최우선 사항이다."
          }
        ];

  const [selectedId, setSelectedId] = useState(
    requests[0]?.id ?? null
  );

  const selectedRequest =
    requests.find((request) => request.id === selectedId) ?? null;

  const riskData = {
    LOW: {
      label: "낮음",
      className: "border border-[#6f8c7c] bg-[#6f8c7c]/10 text-[#3d5a4c]"
    },
    MEDIUM: {
      label: "보통",
      className: "border border-[#ad8a49] bg-[#ad8a49]/10 text-[#7a5a1f]"
    },
    HIGH: {
      label: "높음",
      className: "border border-[#b4633a] bg-[#b4633a]/10 text-[#8a3f22]"
    },
    SEVERE: {
      label: "극심",
      className: "border border-[#a4383c] bg-[#6e1f24]/10 text-[#6e1f24]"
    }
  };

  const handleAccept = () => {
    if (!selectedRequest) return;

    const riskLabel =
      riskData[selectedRequest.risk]?.label || selectedRequest.risk;

    const missionMsg = `[
  huntMissionInProgress = true,
  huntMission = {
    id: "${selectedRequest.id}",
    title: "${selectedRequest.title}",
    issuer: "${selectedRequest.issuer}",
    target: "${selectedRequest.target}",
    lastSeen: "${selectedRequest.lastSeen}",
    reward: "${selectedRequest.reward}",
    risk: "${riskLabel}",
    memo: "${selectedRequest.memo}"
  }
]`;

    sendMessage(missionMsg);
  };

  const StagMark = () => (
    <svg
      viewBox="0 0 48 48"
      className="h-10 w-10 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M24 18c-3.2-3.2-4.8-6.2-5.2-9.8M20.5 13.2c-3-1.2-5-3.4-6.1-6.6M18.8 9.6c-2.3-.4-4.2-1.5-5.8-3.2M24 18c3.2-3.2 4.8-6.2 5.2-9.8M27.5 13.2c3-1.2 5-3.4 6.1-6.6M29.2 9.6c2.3-.4 4.2-1.5 5.8-3.2"
        fill="none"
        stroke="#1a1712"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M17.5 19.2c1.8-2.4 3.9-3.6 6.5-3.6s4.7 1.2 6.5 3.6L29 31c-.9 5.3-9.1 5.3-10 0Z"
        fill="#1a1712"
      />
      <path d="M18.4 22.2 13 19.5l3.8 6.1Z" fill="#1a1712" />
      <path d="m29.6 22.2 5.4-2.7-3.8 6.1Z" fill="#1a1712" />
      <path
        d="M11 37 36 14"
        stroke="#6e1f24"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path d="m36 14-4.2.8 3 3.1Z" fill="#6e1f24" />
    </svg>
  );

  const QuillIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path
        d="M19.5 3.5C14 4 8.2 7.2 5.3 12.4c-1.6 2.8-1.5 5.5-.8 7.1 1.7.6 4.4.7 7.1-.9 5.2-3 8.4-8.7 8.9-14.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M5.2 18.8 14.8 9.2M7.8 15.2l3 .2M10.7 12.3l3 .2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );

  const TargetIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );

  const PinIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path
        d="M12 21s6-5.8 6-11a6 6 0 1 0-12 0c0 5.2 6 11 6 11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="10" r="2" fill="currentColor" />
    </svg>
  );

  const CoinIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <ellipse cx="12" cy="8" rx="7" ry="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 8v4c0 2.2 3.1 4 7 4s7-1.8 7-4V8M5 12v4c0 2.2 3.1 4 7 4s7-1.8 7-4v-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );

  const RequestCard = ({ request, index }) => {
    const risk =
      riskData[request.risk] ?? riskData.MEDIUM;

    const isSelected = selectedId === request.id;

    return (
      <button
        type="button"
        onClick={() => setSelectedId(request.id)}
        className={cn(
          `
            relative w-full border px-3 py-3 text-left
            transition-all duration-150
          `,
          isSelected
            ? "border-[#1a1712] bg-[#efe9db] shadow-[inset_4px_0_0_#6e1f24]"
            : "border-[#c9c2b0] bg-[#f7f4ec] hover:bg-[#efe9db]"
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              `
                mt-0.5 flex h-5 w-5 shrink-0 items-center
                justify-center rounded-full border
              `,
              isSelected
                ? "border-[#4a1216] bg-[#6e1f24]"
                : "border-[#a39c8a] bg-transparent"
            )}
          >
            {isSelected && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#f7f4ec]" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[9px] font-black tracking-[0.13em] text-[#6b6558]">
                  FILE {String(index + 1).padStart(2, "0")} · {request.id}
                </div>

                <h3 className="mt-1 text-[13px] font-black leading-tight tracking-[-0.02em] text-[#1a1712]">
                  {request.title}
                </h3>
              </div>

              <span
                className={cn(
                  "shrink-0 px-1.5 py-0.5 text-[9px] font-black",
                  risk.className
                )}
              >
                위험도 {risk.label}
              </span>
            </div>

            <div className="mt-2.5 grid gap-1.5 text-[#2c2820]">
              <div className="grid grid-cols-[54px_minmax(0,1fr)] gap-2">
                <span className="text-[9px] font-black text-[#4a453c]">
                  발신자
                </span>
                <span className="break-words text-[11px] font-bold leading-snug">
                  {request.issuer}
                </span>
              </div>

              <div className="grid grid-cols-[54px_minmax(0,1fr)] gap-2">
                <span className="text-[9px] font-black text-[#4a453c]">
                  대상
                </span>
                <span className="break-words text-[11px] font-bold leading-snug">
                  {request.target}
                </span>
              </div>
            </div>

            <div className="mt-2.5 flex items-start gap-1.5 border-t border-dashed border-[#c9c2b0] pt-2">
              <PinIcon />

              <div className="min-w-0 flex-1">
                <div className="text-[8px] font-black tracking-[0.08em] text-[#4a453c]">
                  마지막 목격 장소
                </div>

                <div className="mt-0.5 break-words text-[10.5px] font-black leading-snug text-[#1a1712]">
                  {request.lastSeen}
                </div>
              </div>

              <div className="ml-2 flex shrink-0 items-center gap-1 self-end text-[11px] font-black text-[#1a1712]">
                <CoinIcon />
                {request.reward}
              </div>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="relative w-full max-w-none select-none py-4">
      {/* 서류철 뒤판 */}
      <div className="absolute inset-x-5 top-7 bottom-2 rotate-[0.4deg] border border-[#14110d] bg-[#221e18] shadow-[0_16px_32px_rgba(0,0,0,0.28)]" />

      {/* 의뢰서 본체 */}
      <div
        className="
          relative z-10 overflow-hidden border border-[#2a2620]
          bg-[#f7f4ec] px-4 pb-4 pt-3
          text-[#1a1712]
          shadow-[0_12px_28px_rgba(20,17,13,0.28)]
        "
      >
        {/* 상단 고정 클립 */}
        <div className="absolute left-1/2 top-0 h-5 w-24 -translate-x-1/2 rounded-b-md border-x border-b border-[#14110d] bg-[#2a2620] shadow-[0_2px_3px_rgba(0,0,0,0.2)]" />

        <div className="mt-4 flex items-start justify-between gap-3 border-b-2 border-[#1a1712] pb-3">
          <div className="flex min-w-0 items-center gap-3">
            <StagMark />

            <div className="min-w-0">
              <div className="text-[9px] font-black uppercase tracking-[0.18em] text-[#6b6558]">
                {seal}
              </div>

              <h1 className="mt-0.5 text-[18px] font-black leading-none tracking-[-0.04em] text-[#1a1712]">
                황실 사냥대 의뢰서
              </h1>

              <div className="mt-1 text-[10px] font-bold tracking-[0.04em] text-[#4a453c]">
                {office}
              </div>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div className="text-[9px] font-black tracking-[0.12em] text-[#6b6558]">
              ISSUED
            </div>

            <div className="mt-0.5 text-[10px] font-black text-[#1a1712]">
              {date}
            </div>
          </div>
        </div>

        <div className="py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[9px] font-black tracking-[0.14em] text-[#6b6558]">
                ACTIVE COMMISSIONS
              </div>
              <div className="mt-0.5 text-[12px] font-black text-[#1a1712]">
                현재 접수된 의뢰
              </div>
            </div>

            <div className="border border-[#c9c2b0] px-2 py-1 text-center">
              <div className="text-[8px] font-black tracking-[0.12em] text-[#6b6558]">
                FILES
              </div>
              <div className="text-[12px] font-black text-[#1a1712]">
                {requests.length}
              </div>
            </div>
          </div>
        </div>

        {/* 의뢰 목록 */}
        <div className="space-y-2">
          {requests.map((request, index) => (
            <RequestCard
              key={request.id}
              request={request}
              index={index}
            />
          ))}
        </div>

        {/* 선택된 의뢰 상세 메모 */}
        <div className="mt-3 border-y border-[#c9c2b0] bg-[#efe9db] px-3 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <QuillIcon />

              <div>
                <div className="text-[8px] font-black tracking-[0.14em] text-[#6b6558]">
                  SELECTED FILE
                </div>

                <div className="mt-0.5 text-[11px] font-black text-[#1a1712]">
                  {selectedRequest?.id ?? "NONE"}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1 text-[10px] font-black text-[#1a1712]">
              <CoinIcon />
              {selectedRequest?.reward ?? "—"}
            </div>
          </div>

          <div className="mt-2 border-t border-dashed border-[#c9c2b0] pt-2">
            <div className="flex items-center gap-1.5 text-[9px] font-black tracking-[0.1em] text-[#4a453c]">
              <TargetIcon />
              MEMO
            </div>

            <p className="mt-1.5 whitespace-normal break-words text-[11px] font-bold leading-relaxed text-[#2c2820]">
              {selectedRequest?.memo ??
                "의뢰를 선택하십시오."}
            </p>
          </div>
        </div>

        {/* 수락 버튼 */}
        <button
          type="button"
          onClick={handleAccept}
          disabled={!selectedRequest}
          className={cn(
            `
              mt-3 flex w-full min-h-[44px]
              items-center justify-center gap-2
              border border-[#3d0f12]
              bg-[#6e1f24] px-4 py-3
              text-[11px] font-black tracking-[0.12em]
              text-[#f7f4ec]
              shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_3px_0_#3d0f12]
              transition-all active:translate-y-0.5
            `,
            !selectedRequest &&
              "cursor-not-allowed opacity-50"
          )}
        >
          <QuillIcon />
          선택한 의뢰 수락
        </button>

        {/* 하단 발행 정보 */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#c9c2b0] pt-2">
          <span className="text-[8px] font-black uppercase tracking-[0.12em] text-[#6b6558]">
            Royal Hunting Office
          </span>

          <span className="text-[8px] font-black uppercase tracking-[0.12em] text-[#6b6558]">
            One Commission Only
          </span>
        </div>
      </div>
    </div>
  );
}

export default RequestBoard;
