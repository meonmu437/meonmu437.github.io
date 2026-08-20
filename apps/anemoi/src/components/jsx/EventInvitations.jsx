import { useState } from 'react';

function EventInvitations(props = {}) {
  const cn = (...classes) => classes.filter(Boolean).join(" ");

  const source = Array.isArray(props.data)
    ? props.data[0] ?? {}
    : props;

  const {
    season = "봄 사교 시즌",
    issueDate = "5월 3일",
    events: rawEvents
  } = source;

  const events =
    Array.isArray(rawEvents) && rawEvents.length > 0
      ? rawEvents.slice(0, 3)
      : [
          {
            id: "EVT-0511",
            name: "황궁 봄맞이 대무도회",
            date: "5월 11일 · 오후 8시",
            location: "황궁 백장미 홀",
            dressCode: "정장 예복 · 금색 또는 아이보리 장식 권장",
            attendees: [
              "황제 아우렐리안",
              "에르덴 공작 부부",
              "라파엘 에르덴",
              "북부 유력 귀족가"
            ],
            rumor:
              "황실이 올해 안으로 공표할 혼담 후보 가운데 몇몇이 이날 처음 한자리에 모일 것이라는 소문."
          },
          {
            id: "EVT-0514",
            name: "벨로아 후작가 자선 음악회",
            date: "5월 14일 · 오후 6시 30분",
            location: "벨로아 저택 오렌지 온실",
            dressCode: "세미 포멀 · 옅은 봄색 계열",
            attendees: [
              "벨로아 후작 영애",
              "남부 해운 귀족가",
              "황실 시종국 인사",
              "신진 예술 후원자들"
            ],
            rumor:
              "공연보다 뒤풀이 응접실의 자리 배치가 더 중요하다는 평. 두 가문의 비공식 혼담 접촉이 예정되어 있다는 말이 돈다."
          },
          {
            id: "EVT-0518",
            name: "에버우드 초여름 사냥 연회",
            date: "5월 18일 · 오전 10시",
            location: "에르덴 영지 · 에버우드 사냥 별장",
            dressCode: "승마복 또는 사냥 예복 · 짙은 녹색 권장",
            attendees: [
              "에르덴 공작가",
              "황실 사냥대",
              "서부 영지 귀족",
              "초청된 외부 손님"
            ],
            rumor:
              "라파엘 에르덴이 올해 처음으로 직접 손님 명단을 확인했다는 이야기가 퍼지며, 특정 초대객에 대한 관심설이 번지는 중."
          }
        ];

  const [selectedId, setSelectedId] = useState(
    events[0]?.id ?? null
  );

  const selectedEvent =
    events.find((event) => event.id === selectedId) ?? null;

  const handleAttend = () => {
    if (!selectedEvent) return;

    const attendanceMsg =
      `${selectedEvent.name} 초대를 수락한다. ` +
      `라파엘은 ${selectedEvent.date}, ${selectedEvent.location}에서 열리는 행사에 참석한다.`;

    sendMessage(attendanceMsg);
  };

  const LaurelDivider = () => (
    <div className="flex items-center gap-2 text-[#6b727c]">
      <span className="h-px flex-1 bg-[#9099a3]" />
      <span className="text-[10px]">✦</span>
      <span className="h-px flex-1 bg-[#9099a3]" />
    </div>
  );

  const CrestMonogram = () => (
    <svg viewBox="0 0 40 40" className="mx-auto h-8 w-8" aria-hidden="true">
      <circle cx="20" cy="20" r="15" fill="none" stroke="#4a5058" strokeWidth="1.1" />
      <circle cx="20" cy="20" r="10.5" fill="none" stroke="#4a5058" strokeWidth="0.9" />
      <path d="M20 12v16M13 20h14" stroke="#4a5058" strokeWidth="0.9" strokeLinecap="round" />
      <path
        d="M20 14l1.6 3.3 3.6.5-2.6 2.6.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.6 3.6-.5Z"
        fill="#4a5058"
      />
    </svg>
  );

  const CalendarIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path
        d="M6 3v3M18 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13H4V6a1 1 0 0 1 1-1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
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

  const DressIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path
        d="M9 4c.4 1.7 1.4 2.6 3 2.6S14.6 5.7 15 4l2.1 4.2-2.6 2.1 2.7 9.7H6.8l2.7-9.7-2.6-2.1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );

  const GuestIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.8 18c.5-3.2 2.4-5 5.2-5s4.7 1.8 5.2 5M15.5 6.2c2.1.1 3.5 1.5 3.5 3.3 0 1.5-.9 2.7-2.3 3.1M16 13.4c2.4.3 3.9 1.8 4.2 4.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );

  const WhisperIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path
        d="M5 6.5h14v8H11l-4.2 3v-3H5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 10h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );

  const EventCard = ({ event, index }) => {
    const isSelected = selectedId === event.id;
    const attendees = Array.isArray(event.attendees)
      ? event.attendees
      : typeof event.attendees === "string"
      ? [event.attendees]
      : [];

    return (
      <button
        type="button"
        onClick={() => setSelectedId(event.id)}
        className={cn(
          `
            relative w-full border px-3 py-3 text-left
            transition-all duration-150
          `,
          isSelected
            ? "translate-x-[3px] -translate-y-[1px] border-[#2e343c] bg-[#eef0f2] shadow-[inset_4px_0_0_#4a5058,0_8px_18px_rgba(20,22,26,0.22)]"
            : "border-[#c7cbd1] bg-[#f5f1e8] hover:bg-[#eef0f2]"
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
                ? "border-[#2e343c] bg-[#4a5058]"
                : "border-[#9099a3] bg-transparent"
            )}
          >
            {isSelected && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#f5f1e8]" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[8px] font-black uppercase tracking-[0.14em] text-[#6b727c]">
                  INVITATION {String(index + 1).padStart(2, "0")} · {event.id}
                </div>

                <h3 className="mt-1 text-[13px] font-black leading-tight tracking-[-0.02em] text-[#1c1e22]">
                  {event.name}
                </h3>
              </div>
            </div>

            <div className="mt-2.5 grid gap-1.5 text-[#33383f]">
              <div className="flex items-start gap-2">
                <CalendarIcon />
                <span className="break-words text-[10.5px] font-bold leading-snug">
                  {event.date}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <PinIcon />
                <span className="break-words text-[10.5px] font-bold leading-snug">
                  {event.location}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <DressIcon />
                <span className="break-words text-[10.5px] font-bold leading-snug">
                  {event.dressCode}
                </span>
              </div>
            </div>

            <div className="mt-2.5 border-t border-dashed border-[#c7cbd1] pt-2">
              <div className="flex items-start gap-2">
                <GuestIcon />

                <div className="min-w-0 flex-1">
                  <div className="text-[8px] font-black tracking-[0.09em] text-[#6b727c]">
                    참석 예정 인물
                  </div>

                  <div className="mt-1 flex flex-wrap gap-1">
                    {attendees.slice(0, 4).map((guest, guestIndex) => (
                      <span
                        key={`${guest}-${guestIndex}`}
                        className="
                          border-y border-[#c7cbd1]
                          px-1.5 py-0.5
                          text-[8.5px] font-bold text-[#33383f]
                        "
                      >
                        {guest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="relative w-full max-w-none select-none py-4">
      {/* 초대장 받침 */}
      <div className="absolute inset-x-5 top-7 bottom-3 rotate-[-0.4deg] border border-[#2e343c] bg-[#3a4048] shadow-[0_15px_32px_rgba(0,0,0,0.20)]" />

      {/* 본체 */}
      <div
        className="
          relative z-10 overflow-hidden border border-[#4a5058]
          bg-[#f5f1e8] px-4 pb-4 pt-4
          text-[#1c1e22]
          shadow-[0_12px_28px_rgba(20,22,26,0.24)]
        "
      >
        <div className="text-center">
          <div className="text-[8px] font-black uppercase tracking-[0.2em] text-[#6b727c]">
            Imperial Society Season
          </div>

          <div className="mt-2">
            <CrestMonogram />
          </div>

          <div className="mt-2">
            <LaurelDivider />
          </div>

          <h1 className="mt-2 font-serif text-[19px] font-black leading-none tracking-[-0.035em] text-[#1c1e22]">
            사교계 행사 초대장
          </h1>

          <div className="mt-1 text-[10px] font-black tracking-[0.08em] text-[#4a5058]">
            {season}
          </div>

          <div className="mt-1 text-[9px] font-bold text-[#6b727c]">
            발행일 {issueDate}
          </div>

          <div className="mt-2">
            <LaurelDivider />
          </div>
        </div>

        {/* 초대장 목록 */}
        <div className="mt-3 space-y-2">
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
            />
          ))}
        </div>

        {/* 선택된 행사 상세 */}
        <div className="mt-3 border-y border-[#9099a3] bg-[#eef0f2] px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[8px] font-black uppercase tracking-[0.14em] text-[#6b727c]">
                Selected Invitation
              </div>

              <div className="mt-0.5 text-[11px] font-black text-[#1c1e22]">
                {selectedEvent?.name ?? "행사를 선택하십시오."}
              </div>
            </div>

            <div className="shrink-0 text-[9px] font-black text-[#4a5058]">
              {selectedEvent?.id ?? "NONE"}
            </div>
          </div>

          <div className="mt-2 border-t border-dashed border-[#9099a3] pt-2">
            <div className="flex items-center gap-1.5 text-[8px] font-black tracking-[0.1em] text-[#6b727c]">
              <WhisperIcon />
              소문
            </div>

            <p className="mt-1.5 whitespace-normal break-words text-[10.5px] font-bold leading-relaxed text-[#33383f]">
              {selectedEvent?.rumor ??
                "행사를 선택하면 현재 사교계에 도는 소문이 표시됩니다."}
            </p>
          </div>
        </div>

        {/* 참석 버튼 */}
        <button
          type="button"
          onClick={handleAttend}
          disabled={!selectedEvent}
          className={cn(
            `
              mt-3 flex w-full min-h-[44px]
              items-center justify-center gap-2
              border border-[#14171a]
              bg-[#2e343c] px-4 py-3
              text-[11px] font-black tracking-[0.12em]
              text-[#f5f1e8]
              shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_3px_0_#14171a]
              transition-all active:translate-y-0.5
            `,
            !selectedEvent &&
              "cursor-not-allowed opacity-50"
          )}
        >
          <CalendarIcon />
          선택한 행사에 참석
        </button>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#c7cbd1] pt-2">
          <span className="text-[8px] font-black uppercase tracking-[0.12em] text-[#5a6068]">
            Imperial Social Office
          </span>

          <span className="text-[8px] font-black uppercase tracking-[0.12em] text-[#5a6068]">
            One Invitation at a Time
          </span>
        </div>
      </div>
    </div>
  );
}

export default EventInvitations;
