import { useState } from 'react';

function RiderRequestTerminal({
  data = null,
  dateTime = "5월 22일 · 23:52",
  channel = "CH.09",
  requests = "[]",
}) {
  const stopEvent = (event) => {
    event?.stopPropagation?.();
  };

  const defaultRequests = [
    {
      id: "REQ-0173",
      type: "DELIVERY",
      title: "북부 정거장 긴급 의약품 운송",
      issuer: "17번 정거장 의료반",
      origin: "17번 정거장",
      destination: "북부 터널 임시 진료소",
      reward: "420 CR",
      risk: "HIGH",
      status: "OPEN",
      summary: "냉각 의료 상자 세 개를 북부 터널의 임시 진료소까지 운송한다.",
    },
    {
      id: "REQ-0174",
      type: "ESCORT",
      title: "지도 제작자 야간 호송",
      issuer: "서부 지도 조합",
      origin: "폐쇄된 대학 기록관",
      destination: "12번 정거장",
      reward: "650 CR",
      risk: "MEDIUM",
      status: "OPEN",
      summary:
        "구도로 자료를 회수한 지도 제작자 한 명을 12번 정거장까지 호송한다.",
    },
    {
      id: "REQ-0175",
      type: "RECOVERY",
      title: "실종 라이더와 바이크 회수",
      issuer: "동부 운송 연합",
      origin: "34번 폐주유소",
      destination: "17번 정거장 귀환",
      reward: "900 CR",
      risk: "SEVERE",
      status: "OPEN",
      summary:
        "34번 폐주유소 부근에서 사라진 라이더와 검은색 화물 바이크를 수색한다.",
    },
  ];

  const parseValue = (value, fallback) => {
    try {
      if (typeof value !== "string") return value ?? fallback;
      if (!value.trim()) return fallback;
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  };

  const parsedData = parseValue(data, null);
  const sourceData = Array.isArray(parsedData)
    ? parsedData[0] && typeof parsedData[0] === "object"
      ? parsedData[0]
      : {}
    : parsedData && typeof parsedData === "object"
      ? parsedData
      : {};

  const resolvedDateTime = sourceData.dateTime || dateTime;
  const resolvedChannel = sourceData.channel || channel;
  const requestSource = sourceData.requests ?? requests;
  const parsedRequests = parseValue(requestSource, []);

  const normalizeRequest = (request, index) => {
    const item = request && typeof request === "object" ? request : {};

    return {
      id: item.id || `REQ-${String(index + 1).padStart(4, "0")}`,
      type: String(item.type || "OTHER").toUpperCase(),
      title: item.title || "제목 없는 의뢰",
      issuer: item.issuer || "의뢰인 정보 없음",
      origin: item.origin || "출발지 미상",
      destination: item.destination || "목적지 미상",
      reward: item.reward || "보상 미정",
      risk: String(item.risk || "MEDIUM").toUpperCase(),
      status: item.status || "OPEN",
      summary: item.summary || "의뢰 설명이 없습니다.",
    };
  };

  const requestList = (
    Array.isArray(parsedRequests) && parsedRequests.length > 0
      ? parsedRequests
      : defaultRequests
  )
    .slice(0, 3)
    .map(normalizeRequest);

  const [selectedId, setSelectedId] = useState(requestList[0]?.id ?? null);
  const [actionStatus, setActionStatus] = useState("");

  const selectedRequest =
    requestList.find((request) => request.id === selectedId) ||
    requestList[0] ||
    null;

  const typeData = {
    DELIVERY: { label: "운송", symbol: "▣" },
    ESCORT: { label: "호송", symbol: "◆" },
    RECOVERY: { label: "회수", symbol: "⚒" },
    OTHER: { label: "기타", symbol: "◉" },
  };

  const riskData = {
    LOW: {
      label: "낮음",
      border: "#56674b",
      background: "#a8b487",
    },
    MEDIUM: {
      label: "보통",
      border: "#756a43",
      background: "#c2b377",
    },
    HIGH: {
      label: "높음",
      border: "#855c3f",
      background: "#c89668",
    },
    SEVERE: {
      label: "극심",
      border: "#7e443e",
      background: "#ba7064",
    },
  };

  const handleSelect = (event, requestId) => {
    stopEvent(event);
    setSelectedId(requestId);
    setActionStatus("");
  };

  const sendSafely = (message) => {
    try {
      if (typeof sendMessage === "function") {
        sendMessage(message);
        return true;
      }
    } catch (error) {
      return false;
    }

    try {
      if (
        typeof globalThis !== "undefined" &&
        typeof globalThis.sendMessage === "function"
      ) {
        globalThis.sendMessage(message);
        return true;
      }
    } catch (error) {
      return false;
    }

    return false;
  };

  const handleAccept = (event) => {
    stopEvent(event);
    if (!selectedRequest) return;

    const typeLabel =
      typeData[selectedRequest.type]?.label || selectedRequest.type;

    const quote = (value) => JSON.stringify(String(value ?? ""));

    const missionMsg = `[
  missionInProgress = true,
  missionId = ${quote(selectedRequest.id)},
  missionType = ${quote(typeLabel)},
  missionTitle = ${quote(selectedRequest.title)},
  missionIssuer = ${quote(selectedRequest.issuer)},
  missionRoute = ${quote(`${selectedRequest.origin} → ${selectedRequest.destination}`)},
  missionReward = ${quote(selectedRequest.reward)}
]`;

    const sent = sendSafely(missionMsg);
    setActionStatus(
      sent
        ? "의뢰 수락 메시지를 전송했습니다."
        : "sendMessage 함수를 찾을 수 없어 전송하지 못했습니다.",
    );
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
            backgroundColor: index < 3 ? "#293521" : "transparent",
            border: index < 3 ? "none" : "1px solid #43513a",
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
          style={{
            width: "75%",
            height: "100%",
            backgroundColor: "#2e3b27",
          }}
        />
      </div>
      <div
        style={{ width: "2px", height: "6px", backgroundColor: "#35432e" }}
      />
    </div>
  );

  const RequestCard = ({ request, index }) => {
    const type = typeData[request.type] || typeData.OTHER;
    const risk = riskData[request.risk] || riskData.MEDIUM;
    const isSelected = selectedRequest?.id === request.id;

    return (
      <button
        type="button"
        onClick={(event) => handleSelect(event, request.id)}
        onMouseDown={stopEvent}
        onPointerDown={stopEvent}
        aria-pressed={isSelected}
        style={{
          position: "relative",
          width: "100%",
          padding: "12px",
          border: isSelected ? "2px solid #27341f" : "2px solid #59664c",
          backgroundColor: isSelected ? "#a2af79" : "rgba(183,193,141,0.68)",
          color: "#25301f",
          textAlign: "left",
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: isSelected ? "inset 0 0 0 1px rgba(39,52,31,0.3)" : "none",
          transition: "background-color 150ms ease, border-color 150ms ease",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div
            aria-hidden="true"
            style={{
              display: "flex",
              width: "20px",
              height: "20px",
              marginTop: "2px",
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "center",
              border: isSelected ? "2px solid #27341f" : "2px solid #667257",
              backgroundColor: isSelected ? "#303d28" : "transparent",
              boxSizing: "border-box",
            }}
          >
            {isSelected && (
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#b9c590",
                }}
              />
            )}
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "8px",
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
                  aria-hidden="true"
                  style={{ flexShrink: 0, fontSize: "15px" }}
                >
                  {type.symbol}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 900,
                    letterSpacing: "0.1em",
                  }}
                >
                  {String(index + 1).padStart(2, "0")} · {type.label}
                </span>
              </div>

              <span
                style={{
                  flexShrink: 0,
                  border: `1px solid ${risk.border}`,
                  backgroundColor: risk.background,
                  padding: "2px 6px",
                  fontSize: "10px",
                  fontWeight: 900,
                }}
              >
                {risk.label}
              </span>
            </div>

            <h3
              style={{
                margin: "6px 0 0",
                fontSize: "13px",
                fontWeight: 900,
                lineHeight: 1.3,
                letterSpacing: "-0.03em",
              }}
            >
              {request.title}
            </h3>

            <p
              style={{
                margin: "6px 0 0",
                whiteSpace: "normal",
                overflowWrap: "anywhere",
                fontSize: "11px",
                fontWeight: 700,
                lineHeight: 1.65,
                opacity: 0.82,
              }}
            >
              {request.summary}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                gap: "12px",
                marginTop: "10px",
                borderTop: "1px dashed #647156",
                paddingTop: "8px",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "6px",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{ marginTop: "1px", flexShrink: 0 }}
                  >
                    ⌖
                  </span>
                  <p
                    style={{
                      margin: 0,
                      overflowWrap: "anywhere",
                      fontSize: "11px",
                      fontWeight: 900,
                      lineHeight: 1.45,
                    }}
                  >
                    {request.origin}
                    <span style={{ margin: "0 4px", opacity: 0.5 }}>→</span>
                    {request.destination}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  alignSelf: "end",
                  gap: "4px",
                  fontSize: "12px",
                  fontWeight: 900,
                }}
              >
                <span aria-hidden="true">◎</span>
                {request.reward}
              </div>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div
      onClick={stopEvent}
      onMouseDown={stopEvent}
      onPointerDown={stopEvent}
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "20px",
        color: "#25301f",
        userSelect: "none",
        boxSizing: "border-box",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          right: "32px",
          zIndex: 0,
          width: "20px",
          height: "40px",
          borderTop: "2px solid #252b25",
          borderRight: "2px solid #252b25",
          borderLeft: "2px solid #252b25",
          borderRadius: "6px 6px 0 0",
          backgroundColor: "#4b5149",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "3px",
            height: "20px",
            margin: "4px auto 0",
            borderRadius: "999px",
            backgroundColor: "#262b26",
          }}
        />
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "112px",
          right: "-8px",
          width: "20px",
          height: "144px",
          borderTop: "2px solid #272d27",
          borderRight: "2px solid #272d27",
          borderBottom: "2px solid #272d27",
          borderRadius: "0 12px 12px 0",
          backgroundColor: "#50564e",
          boxShadow: "4px 5px 10px rgba(0,0,0,0.3)",
          boxSizing: "border-box",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          padding: "16px",
          border: "2px solid #252a25",
          borderRadius: "34px",
          backgroundColor: "#555b52",
          boxShadow:
            "inset 2px 2px 0 rgba(255,255,255,0.07), inset -3px -4px 0 rgba(0,0,0,0.18), 0 24px 55px rgba(0,0,0,0.42)",
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
                border: "1px solid #30362f",
                borderRadius: "50%",
                backgroundColor: "#454b44",
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
                  backgroundColor: "#252a25",
                  transform: "translate(-50%, -50%) rotate(45deg)",
                }}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "12px",
            padding: "0 4px",
          }}
        >
          <div>
            <div
              style={{
                color: "#252a25",
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              NIGHT HIGHWAY
            </div>
            <div
              style={{
                marginTop: "2px",
                color: "#343a34",
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Rider Dispatch Receiver
            </div>
          </div>

          <div
            style={{
              flexShrink: 0,
              border: "1px solid #343a34",
              borderRadius: "2px",
              padding: "2px 6px",
              color: "#2b302b",
              fontSize: "10px",
              fontWeight: 900,
            }}
          >
            NH-D17
          </div>
        </div>

        <div
          style={{
            padding: "8px",
            border: "2px solid #222722",
            borderRadius: "20px",
            backgroundColor: "#171b18",
            boxShadow: "inset 0 3px 9px rgba(0,0,0,0.75)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "relative",
              minHeight: "520px",
              overflow: "hidden",
              padding: "12px",
              border: "1px solid #788262",
              borderRadius: "11px",
              backgroundColor: "#b4bf88",
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(42,53,34,0.04) 0px, rgba(42,53,34,0.04) 1px, transparent 1px, transparent 3px)",
              boxShadow: "inset 0 0 18px rgba(48,62,36,0.35)",
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
                  style={{ flexShrink: 0, fontSize: "10px", fontWeight: 900 }}
                >
                  {resolvedChannel}
                </span>
                <span
                  style={{ height: "12px", borderLeft: "1px solid #59664f" }}
                />
                <span
                  style={{
                    minWidth: 0,
                    overflowWrap: "anywhere",
                    fontSize: "11px",
                    fontWeight: 700,
                    lineHeight: 1.3,
                  }}
                >
                  {resolvedDateTime}
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

            <header style={{ padding: "12px 0" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "10px",
                      fontWeight: 900,
                      letterSpacing: "0.1em",
                    }}
                  >
                    <span aria-hidden="true">⌁</span>
                    INCOMING REQUESTS
                  </div>
                  <h1
                    style={{
                      margin: "4px 0 0",
                      fontSize: "17px",
                      fontWeight: 900,
                      lineHeight: 1.25,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    신규 라이더 의뢰
                  </h1>
                </div>

                <div
                  style={{
                    flexShrink: 0,
                    border: "2px solid #48563d",
                    padding: "4px 8px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "10px", fontWeight: 900 }}>
                    SIGNAL
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      marginTop: "2px",
                      fontSize: "10px",
                      fontWeight: 900,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#2c3925",
                        boxShadow: "0 0 5px rgba(44,57,37,0.5)",
                      }}
                    />
                    LIVE
                  </div>
                </div>
              </div>
            </header>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {requestList.map((request, index) => (
                <RequestCard key={request.id} request={request} index={index} />
              ))}
            </div>

            <div
              style={{
                marginTop: "12px",
                border: "2px solid #4c5a40",
                backgroundColor: "#a3ae7d",
                padding: "10px",
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
                    fontSize: "10px",
                    fontWeight: 900,
                    letterSpacing: "0.1em",
                  }}
                >
                  SELECTED FILE
                </span>
                <span style={{ fontSize: "10px", fontWeight: 900 }}>
                  {selectedRequest?.id || "NONE"}
                </span>
              </div>
              <p
                style={{
                  margin: "4px 0 0",
                  overflowWrap: "anywhere",
                  fontSize: "11px",
                  fontWeight: 900,
                  lineHeight: 1.6,
                }}
              >
                {selectedRequest?.title || "의뢰를 선택하십시오."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAccept}
              onMouseDown={stopEvent}
              onPointerDown={stopEvent}
              disabled={!selectedRequest}
              style={{
                display: "flex",
                width: "100%",
                minHeight: "44px",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "12px",
                padding: "10px 16px",
                border: "2px solid #34422c",
                borderRadius: "4px",
                backgroundColor: selectedRequest ? "#d2a84f" : "#79785f",
                color: selectedRequest ? "#20281c" : "#44483a",
                boxShadow: selectedRequest
                  ? "inset 0 1px 0 rgba(255,255,255,0.28), 0 4px 0 #735a28, 0 0 12px rgba(210,168,79,0.32)"
                  : "inset 0 1px 0 rgba(255,255,255,0.08)",
                cursor: selectedRequest ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                fontSize: "12px",
                fontWeight: "900",
                letterSpacing: "0.08em",
                lineHeight: 1,
                textTransform: "uppercase",
                opacity: selectedRequest ? 1 : 0.55,
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
                boxSizing: "border-box",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontSize: "14px",
                  fontWeight: "900",
                  lineHeight: 1,
                }}
              >
                ◉
              </span>

              <span>선택한 의뢰 수락</span>

              <span
                aria-hidden="true"
                style={{
                  fontSize: "11px",
                  fontWeight: "900",
                  lineHeight: 1,
                }}
              >
                ▶
              </span>
            </button>

            {actionStatus && (
              <div
                role="status"
                style={{
                  marginTop: "8px",
                  border: "1px dashed #556149",
                  backgroundColor: "rgba(163,174,125,0.62)",
                  padding: "8px 10px",
                  fontSize: "10px",
                  fontWeight: 800,
                  lineHeight: 1.5,
                }}
              >
                {actionStatus}
              </div>
            )}

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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            marginTop: "16px",
            padding: "0 4px",
          }}
        >
          <div>
            <div
              style={{
                marginBottom: "6px",
                color: "#2c312c",
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Speaker
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

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                color: "#2b302b",
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Request
            </span>
            <span
              aria-hidden="true"
              style={{
                width: "10px",
                height: "10px",
                border: "1px solid #6f5c2e",
                borderRadius: "50%",
                backgroundColor: "#c79c4f",
                boxShadow: "0 0 5px rgba(199,156,79,0.45)",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginTop: "16px",
            borderTop: "1px solid #3c423c",
            padding: "8px 4px 0",
          }}
        >
          <span
            style={{
              color: "#303630",
              fontSize: "10px",
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Station Relay
          </span>
          <span
            style={{
              color: "#303630",
              fontSize: "10px",
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            One Contract Only
          </span>
        </div>
      </div>
    </div>
  );
}

export default RiderRequestTerminal;
