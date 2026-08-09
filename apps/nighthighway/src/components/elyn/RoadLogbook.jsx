import { useState } from 'react';

function RoadLogbook({
  characterName = "Noé Valenti",
  callSign = "COYOTE",
  initialPage = 0,
  logs = "[]",
  diaries = "[]",
}) {
  const defaultLogs = [
    {
      id: "LOG-017-0522",
      date: "2025-05-22",
      day: "THU",
      time: "23:47",
      weather: "맑음",
      title: "북부 검문소 앞에서",
      origin: "17번 정거장",
      destination: "북부 검문소",
      location: "폐쇄된 17번 국도 · 북쪽 12km",
      odometer: "84,219 km",
      distance: "126 km",
      fuel: "42%",
      roadCondition: "균열 · 낙석 흔적",
      content:
        "해가 완전히 떨어진 뒤 17번 정거장을 출발했다. 정거장 관리인은 북쪽 터널이 열렸다고 했지만, 도로 위 타이어 자국은 전부 남쪽으로 향해 있었다.\n\n검문소에서 약 12km 떨어진 지점에서 엔진을 껐다. 멀리 불빛이 두 번 깜박였고, 잠시 뒤 무전기에서 잡음이 들렸다. 신호는 짧았고 호출 부호는 없었다. 누군가 기다리고 있거나, 기다리는 척하고 있다.",
      incident:
        "도로 한가운데 세워진 흰색 표지판을 발견. 기존 지도에는 없는 우회로가 표시되어 있었음.",
      maintenance:
        "후륜 체인 장력 조정. 오른쪽 전조등 접촉 불량은 아직 남아 있음.",
      radio: "CH.09에서 미확인 신호 2회 수신. '돌아가라'는 음성으로 추정.",
      nextRoute: "일출 전 검문소 외곽을 우회해 북동쪽 관리도로로 진입.",
      note: "새 표지판은 믿지 않는다. 하지만 오래된 지도도 이제는 마찬가지다.",
    },
    {
      id: "LOG-017-0523",
      date: "2025-05-23",
      day: "FRI",
      time: "02:16",
      weather: "비",
      title: "죽은 주유소의 불빛",
      origin: "북부 검문소",
      destination: "34번 폐주유소",
      location: "구도로 34번 분기점",
      odometer: "84,301 km",
      distance: "82 km",
      fuel: "19%",
      roadCondition: "침수 · 시야 불량",
      content:
        "비가 세지면서 구도로의 차선이 완전히 사라졌다. 전조등은 물 위에 반사될 뿐 도로 가장자리를 보여주지 못했다.\n\n34번 폐주유소의 간판에는 전기가 들어오지 않았지만, 사무실 안쪽에서 노란빛이 새어 나왔다. 문은 잠겨 있었고 창문에는 안쪽에서 닦아낸 흔적이 남아 있었다. 사람은 보이지 않았다. 연료 탱크 아래에서는 최근에 흘린 오일 냄새가 났다.",
      incident:
        "폐주유소 뒤편에서 검은색 화물 바이크의 타이어 자국 발견. 자국은 숲 쪽에서 끊김.",
      maintenance:
        "예비 연료 1통 사용. 전조등 케이블 임시 고정. 브레이크 패드 점검 필요.",
      radio: "CH.07에서 동부 운송 연합의 자동 호출 반복 수신.",
      nextRoute: "주유소 뒤편 숲길을 확인한 뒤 17번 정거장으로 복귀.",
      note: "불이 켜져 있었다면 누군가는 발전기를 돌렸다. 방금 전까지.",
    },
  ];

  const parseLogList = (value) => {
    try {
      if (Array.isArray(value)) return value;
      if (typeof value !== "string" || value.trim() === "") return [];

      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  const normalizeLog = (log = {}, index = 0) => ({
    id: log.id || `LOG-${String(index + 1).padStart(3, "0")}`,
    date: log.date || "날짜 없음",
    day: log.day || "—",
    time: log.time || "시간 없음",
    weather: log.weather || "미상",
    title: log.title || "제목 없는 기록",
    origin: log.origin || "출발지 미상",
    destination: log.destination || "목적지 미상",
    location: log.location || "위치 미상",
    odometer: log.odometer || "—",
    distance: log.distance || "—",
    fuel: log.fuel || "—",
    roadCondition: log.roadCondition || "정보 없음",
    content: log.content || "주행 기록 없음",
    incident: log.incident || "기록 없음",
    maintenance: log.maintenance || "기록 없음",
    radio: log.radio || "기록 없음",
    nextRoute: log.nextRoute || "다음 경로 미정",
    note: log.note || "남길 말 없음.",
  });

  const parsedLogs = parseLogList(logs);
  const parsedDiaries = parseLogList(diaries);
  const sourceLogs =
    parsedLogs.length > 0
      ? parsedLogs
      : parsedDiaries.length > 0
        ? parsedDiaries
        : defaultLogs;
  const logList = sourceLogs.map(normalizeLog);

  const requestedPage = Number.parseInt(String(initialPage), 10);
  const safeInitialPage =
    Number.isFinite(requestedPage) &&
    requestedPage >= 0 &&
    requestedPage < logList.length
      ? requestedPage
      : 0;

  const [currentPage, setCurrentPage] = useState(safeInitialPage);
  const visiblePage = Math.min(Math.max(currentPage, 0), logList.length - 1);
  const currentLog = logList[visiblePage];

  const weatherSymbol = (weather) => {
    if (weather === "맑음") return "☀";
    if (weather === "비") return "☂";
    if (weather === "구름") return "☁";
    if (weather === "눈") return "❄";
    return "☾";
  };

  const fuelNumber = Number.parseInt(
    String(currentLog?.fuel || "").replace(/[^\d]/g, ""),
    10,
  );
  const lowFuel = Number.isFinite(fuelNumber) && fuelNumber <= 25;

  const handlePrev = (event) => {
    event.stopPropagation();
    setCurrentPage((page) => Math.max(page - 1, 0));
  };

  const handleNext = (event) => {
    event.stopPropagation();
    setCurrentPage((page) => Math.min(page + 1, logList.length - 1));
  };

  const SignalBars = () => (
    <div
      style={{
        display: "flex",
        height: "12px",
        alignItems: "flex-end",
        gap: "2px",
      }}
    >
      {[3, 5, 7, 9].map((height, index) => (
        <span
          key={height}
          style={{
            width: "2px",
            height: `${height}px`,
            borderRadius: "1px",
            backgroundColor: index < 3 ? "#24311e" : "transparent",
            border: index < 3 ? "none" : "1px solid #485540",
            boxSizing: "border-box",
          }}
        />
      ))}
    </div>
  );

  const Battery = () => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          width: "18px",
          height: "9px",
          alignItems: "center",
          border: "1px solid #35432e",
          padding: "1px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{ width: "68%", height: "100%", backgroundColor: "#2c3925" }}
        />
      </div>
      <div
        style={{ width: "2px", height: "6px", backgroundColor: "#35432e" }}
      />
    </div>
  );

  const MetricPanel = ({ symbol, label, value, warning = false }) => (
    <div
      style={{
        minWidth: 0,
        padding: "10px",
        border: warning ? "2px solid #76513e" : "2px solid #536148",
        backgroundColor: warning ? "#c39a70" : "#aab67f",
        boxShadow: "inset 0 0 8px rgba(41,54,31,0.14)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <span
          style={{
            display: "flex",
            minWidth: 0,
            alignItems: "center",
            gap: "6px",
            fontSize: "10px",
            fontWeight: "900",
            letterSpacing: "0.1em",
          }}
        >
          <span aria-hidden="true">{symbol}</span>
          <span>{label}</span>
        </span>
        <span
          style={{
            width: "8px",
            height: "8px",
            flexShrink: 0,
            borderRadius: "50%",
            border: warning ? "1px solid #6d372c" : "1px solid #425139",
            backgroundColor: warning ? "#a64f3e" : "#677d4e",
            boxShadow: warning ? "0 0 6px rgba(166,79,62,0.55)" : "none",
          }}
        />
      </div>
      <div
        style={{
          marginTop: "8px",
          overflowWrap: "anywhere",
          fontSize: "11px",
          fontWeight: "900",
          letterSpacing: "-0.03em",
          lineHeight: "1.4",
        }}
      >
        {value || "—"}
      </div>
    </div>
  );

  const TextPanel = ({ symbol, label, children, warning = false }) => (
    <section
      style={{
        minWidth: 0,
        padding: "12px",
        border: warning ? "2px solid #76513e" : "2px solid #536148",
        backgroundColor: warning
          ? "rgba(195,154,112,0.78)"
          : "rgba(172,183,129,0.68)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
          color: warning ? "#4d281f" : "#334029",
          fontSize: "10px",
          fontWeight: "900",
          letterSpacing: "0.11em",
        }}
      >
        <span aria-hidden="true">{symbol}</span>
        <span>{label}</span>
      </div>
      <p
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
          fontSize: "11px",
          fontWeight: "700",
          lineHeight: "1.65",
        }}
      >
        {children || "기록 없음"}
      </p>
    </section>
  );

  const buttonStyle = (disabled) => ({
    display: "flex",
    height: "40px",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "0 12px",
    borderRadius: "6px",
    border: disabled ? "2px solid #373d37" : "2px solid #292e29",
    backgroundColor: disabled ? "#474d47" : "#3d433d",
    color: disabled ? "#2c312c" : "#171c17",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    boxShadow: "2px 3px 4px rgba(0,0,0,0.25)",
    boxSizing: "border-box",
  });

  if (!currentLog) return null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "20px",
        color: "#202a1b",
        userSelect: "none",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: "36px",
          zIndex: 0,
          width: "20px",
          height: "44px",
          borderTop: "2px solid #232824",
          borderRight: "2px solid #232824",
          borderLeft: "2px solid #232824",
          borderRadius: "6px 6px 0 0",
          backgroundColor: "#484e48",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "3px",
            height: "24px",
            margin: "4px auto 0",
            borderRadius: "999px",
            backgroundColor: "#252a26",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: "176px",
          left: "-8px",
          zIndex: 0,
          width: "20px",
          height: "80px",
          borderTop: "2px solid #222722",
          borderBottom: "2px solid #222722",
          borderLeft: "2px solid #222722",
          borderRadius: "6px 0 0 6px",
          backgroundColor: "#4a504a",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "40px",
            margin: "16px auto 0",
            borderRadius: "999px",
            backgroundColor: "#242925",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          padding: "16px",
          border: "2px solid #222722",
          borderRadius: "32px",
          backgroundColor: "#555b54",
          backgroundImage:
            "radial-gradient(circle at 18% 5%, rgba(255,255,255,0.05), transparent 24%), linear-gradient(135deg, rgba(255,255,255,0.025), transparent 46%)",
          boxShadow:
            "inset 2px 2px 0 rgba(255,255,255,0.06), inset -3px -4px 0 rgba(0,0,0,0.18), 0 24px 55px rgba(0,0,0,0.42)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
            padding: "0 4px",
          }}
        >
          {[0, 1].map((item) => (
            <div
              key={item}
              style={{
                position: "relative",
                width: "12px",
                height: "12px",
                border: "1px solid #303630",
                borderRadius: "50%",
                backgroundColor: "#444a44",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "8px",
                  height: "1px",
                  backgroundColor: "#222722",
                  transform: "translate(-50%, -50%) rotate(45deg)",
                }}
              />
            </div>
          ))}
        </div>

        <header
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "12px",
            padding: "0 4px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                color: "#252a25",
                fontSize: "11px",
                fontWeight: "900",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Night Highway
            </div>
            <div
              style={{
                marginTop: "2px",
                color: "#343a34",
                fontSize: "10px",
                fontWeight: "900",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Analog Digital Road Logger
            </div>
          </div>
          <div
            style={{
              flexShrink: 0,
              padding: "4px 8px",
              border: "1px solid #353b35",
              color: "#2a302a",
              fontSize: "10px",
              fontWeight: "900",
              textAlign: "center",
            }}
          >
            NH-L17
          </div>
        </header>

        <div
          style={{
            padding: "8px",
            border: "2px solid #202521",
            borderRadius: "20px",
            backgroundColor: "#161a17",
            boxShadow: "inset 0 4px 10px rgba(0,0,0,0.75)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "relative",
              minHeight: "400px",
              maxHeight: "520px",
              overflowX: "hidden",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
              scrollbarGutter: "stable",
              padding: "12px",
              border: "2px solid #7d8966",
              borderRadius: "10px",
              backgroundColor: "#b6c18b",
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(32,43,25,0.035) 0px, rgba(32,43,25,0.035) 1px, transparent 1px, transparent 3px), radial-gradient(circle at 50% 20%, rgba(255,255,220,0.13), transparent 64%)",
              boxShadow:
                "inset 0 0 20px rgba(41,55,31,0.36), 0 0 10px rgba(173,192,126,0.13)",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: "11px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
                paddingBottom: "8px",
                borderBottom: "2px solid #48563d",
              }}
            >
              <div
                style={{
                  display: "flex",
                  minWidth: 0,
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{ flexShrink: 0, fontSize: "10px", fontWeight: "900" }}
                >
                  LOG SYS
                </span>
                <span
                  style={{ height: "12px", borderLeft: "1px solid #5b674f" }}
                />
                <span
                  style={{
                    minWidth: 0,
                    overflow: "hidden",
                    fontSize: "11px",
                    fontWeight: "700",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentLog.date} · {currentLog.time}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexShrink: 0,
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <SignalBars />
                <Battery />
              </div>
            </div>

            <div
              style={{ padding: "12px 0", borderBottom: "2px solid #4e5c43" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "10px",
                      fontWeight: "900",
                      letterSpacing: "0.11em",
                    }}
                  >
                    <span aria-hidden="true">⌁</span>
                    ROAD LOG ENTRY
                  </div>
                  <h1
                    style={{
                      margin: "4px 0 0",
                      overflow: "hidden",
                      fontSize: "18px",
                      fontWeight: "900",
                      letterSpacing: "-0.05em",
                      lineHeight: "1.25",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {currentLog.title}
                  </h1>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "11px",
                      fontWeight: "700",
                    }}
                  >
                    {currentLog.id}
                  </p>
                </div>
                <div
                  style={{
                    flexShrink: 0,
                    padding: "4px 8px",
                    border: "2px solid #4c5a41",
                    backgroundColor: "#a4b07d",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "10px", fontWeight: "900" }}>
                    RIDER
                  </div>
                  <div
                    style={{
                      marginTop: "2px",
                      fontSize: "11px",
                      fontWeight: "900",
                    }}
                  >
                    {callSign}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "8px",
                padding: "12px 0",
              }}
            >
              <MetricPanel
                symbol="⌁"
                label="ODOMETER"
                value={currentLog.odometer}
              />
              <MetricPanel
                symbol="▰"
                label="FUEL"
                value={currentLog.fuel}
                warning={lowFuel}
              />
              <MetricPanel
                symbol="➤"
                label="DISTANCE"
                value={currentLog.distance}
              />
              <MetricPanel
                symbol={weatherSymbol(currentLog.weather)}
                label="WEATHER"
                value={`${currentLog.weather} · ${currentLog.day}`}
              />
            </div>

            <section
              style={{
                border: "2px solid #4c5a41",
                backgroundColor: "#a6b27f",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  padding: "8px 12px",
                  borderBottom: "1px dashed #5b684e",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "10px",
                    fontWeight: "900",
                    letterSpacing: "0.1em",
                  }}
                >
                  <span aria-hidden="true">➤</span>
                  ACTIVE ROUTE
                </span>
                <span style={{ fontSize: "10px", fontWeight: "900" }}>
                  ENTRY {String(visiblePage + 1).padStart(2, "0")}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "900",
                      opacity: 0.7,
                    }}
                  >
                    FROM
                  </div>
                  <div
                    style={{
                      marginTop: "4px",
                      overflowWrap: "anywhere",
                      fontSize: "11px",
                      fontWeight: "900",
                      lineHeight: "1.4",
                    }}
                  >
                    {currentLog.origin}
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "1px",
                      backgroundColor: "#45523b",
                    }}
                  />
                  <span aria-hidden="true" style={{ fontSize: "16px" }}>
                    ➤
                  </span>
                  <div
                    style={{
                      width: "12px",
                      height: "1px",
                      backgroundColor: "#45523b",
                    }}
                  />
                </div>

                <div style={{ minWidth: 0, textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "900",
                      opacity: 0.7,
                    }}
                  >
                    TO
                  </div>
                  <div
                    style={{
                      marginTop: "4px",
                      overflowWrap: "anywhere",
                      fontSize: "11px",
                      fontWeight: "900",
                      lineHeight: "1.4",
                    }}
                  >
                    {currentLog.destination}
                  </div>
                </div>
              </div>
            </section>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              <MetricPanel
                symbol="⌖"
                label="POSITION"
                value={currentLog.location}
              />
              <MetricPanel
                symbol="◇"
                label="ROAD"
                value={currentLog.roadCondition}
              />
            </div>

            <section
              style={{
                marginTop: "8px",
                padding: "12px",
                border: "2px solid #4c5a41",
                backgroundColor: "rgba(174,185,133,0.72)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  marginBottom: "8px",
                  paddingBottom: "8px",
                  borderBottom: "1px dashed #5b684e",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "900",
                    letterSpacing: "0.11em",
                  }}
                >
                  PRIMARY ROAD REPORT
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "10px",
                    fontWeight: "900",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#2f3d27",
                      boxShadow: "0 0 5px rgba(47,61,39,0.5)",
                    }}
                  />
                  REC
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                  fontSize: "12px",
                  fontWeight: "700",
                  lineHeight: "1.7",
                }}
              >
                {currentLog.content}
              </p>
            </section>

            <div style={{ marginTop: "8px" }}>
              <TextPanel symbol="⚠" label="INCIDENT / HAZARD" warning>
                {currentLog.incident}
              </TextPanel>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              <TextPanel symbol="⌕" label="MAINTENANCE">
                {currentLog.maintenance}
              </TextPanel>
              <TextPanel symbol="◉" label="RADIO LOG">
                {currentLog.radio}
              </TextPanel>
            </div>

            <section
              style={{
                marginTop: "8px",
                padding: "12px",
                border: "2px solid #4a583f",
                backgroundColor: "#9faa77",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "32px",
                    height: "32px",
                    flexShrink: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #46533c",
                    backgroundColor: "#34422d",
                    color: "#b9c58f",
                    boxSizing: "border-box",
                  }}
                >
                  ➤
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "900",
                      letterSpacing: "0.11em",
                    }}
                  >
                    NEXT ROUTE
                  </div>
                  <p
                    style={{
                      margin: "4px 0 0",
                      overflowWrap: "anywhere",
                      fontSize: "12px",
                      fontWeight: "900",
                      lineHeight: "1.6",
                    }}
                  >
                    {currentLog.nextRoute}
                  </p>
                </div>
              </div>
            </section>

            <section
              style={{
                marginTop: "8px",
                padding: "10px 12px",
                borderLeft: "4px solid #5b493d",
                backgroundColor: "#b89d7d",
                color: "#3c2f29",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "900",
                  letterSpacing: "0.11em",
                }}
              >
                {callSign} / PRIVATE NOTE
              </div>
              <p
                style={{
                  margin: "4px 0 0",
                  overflowWrap: "anywhere",
                  fontSize: "12px",
                  fontWeight: "900",
                  lineHeight: "1.6",
                }}
              >
                “{currentLog.note}”
              </p>
            </section>

            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-64px",
                right: "-56px",
                width: "160px",
                height: "192px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.05)",
                filter: "blur(20px)",
                transform: "rotate(12deg)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
            alignItems: "center",
            gap: "16px",
            marginTop: "16px",
            padding: "0 4px",
          }}
        >
          <div>
            <div
              style={{
                marginBottom: "6px",
                color: "#2d322d",
                fontSize: "10px",
                fontWeight: "900",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Audio
            </div>
            <div
              style={{
                display: "grid",
                width: "fit-content",
                gridTemplateColumns: "repeat(6, 6px)",
                gap: "4px",
              }}
            >
              {Array.from({ length: 18 }).map((_, index) => (
                <span
                  key={index}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#252a25",
                  }}
                />
              ))}
            </div>
          </div>

          <div
            style={{
              position: "relative",
              display: "flex",
              width: "74px",
              height: "74px",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #282d28",
              borderRadius: "50%",
              backgroundColor: "#3f453f",
              boxShadow:
                "inset 0 3px 7px rgba(0,0,0,0.45), 3px 4px 6px rgba(0,0,0,0.28)",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "8px",
                border: "1px solid #555c55",
                borderRadius: "50%",
                backgroundColor: "#353b35",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "4px",
                left: "50%",
                width: "2px",
                height: "16px",
                backgroundColor: "#c19a57",
                transform: "translateX(-50%)",
              }}
            />
            <div
              style={{
                position: "relative",
                color: "#1c211c",
                fontSize: "10px",
                fontWeight: "900",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Select
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  color: "#2d322d",
                  fontSize: "10px",
                  fontWeight: "900",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Record
              </span>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  border: "1px solid #6e5330",
                  borderRadius: "50%",
                  backgroundColor: "#c59145",
                  boxShadow: "0 0 6px rgba(197,145,69,0.35)",
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  border: "1px solid #40513a",
                  borderRadius: "50%",
                  backgroundColor: "#6d8657",
                }}
              />
              <span
                style={{
                  color: "#2d322d",
                  fontSize: "10px",
                  fontWeight: "900",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Memory
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
            alignItems: "center",
            gap: "12px",
            marginTop: "16px",
            paddingTop: "12px",
            borderTop: "1px solid #3c423c",
          }}
        >
          <button
            type="button"
            onClick={handlePrev}
            disabled={visiblePage === 0}
            aria-label="이전 주행 기록"
            style={buttonStyle(visiblePage === 0)}
          >
            <span aria-hidden="true">‹</span>
            Prev
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {logList.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setCurrentPage(index);
                }}
                aria-label={`${index + 1}번 기록 보기`}
                aria-current={index === visiblePage ? "page" : undefined}
                style={{
                  width: index === visiblePage ? "24px" : "10px",
                  height: "10px",
                  padding: 0,
                  border: "1px solid #2d332e",
                  backgroundColor:
                    index === visiblePage ? "#c19752" : "#414741",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={visiblePage === logList.length - 1}
            aria-label="다음 주행 기록"
            style={buttonStyle(visiblePage === logList.length - 1)}
          >
            Next
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <footer
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginTop: "12px",
            padding: "0 4px",
          }}
        >
          <div>
            <div
              style={{
                color: "#303630",
                fontSize: "10px",
                fontWeight: "900",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
              }}
            >
              Registered Rider
            </div>
            <div
              style={{
                marginTop: "2px",
                color: "#252a25",
                fontSize: "11px",
                fontWeight: "900",
              }}
            >
              {characterName}
            </div>
          </div>
          <div
            style={{
              color: "#303630",
              fontSize: "10px",
              fontWeight: "900",
              letterSpacing: "0.08em",
              textAlign: "right",
              textTransform: "uppercase",
            }}
          >
            Road Data Recorder
          </div>
        </footer>
      </div>
    </div>
  );
}

export default RoadLogbook;
