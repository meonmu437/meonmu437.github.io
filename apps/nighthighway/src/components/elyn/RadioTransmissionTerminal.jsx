import { useState } from 'react';

function RadioTransmissionTerminal(props = {}) {
  const parseObject = (value) => {
    try {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
      }

      if (typeof value === "string" && value.trim()) {
        const parsed = JSON.parse(value);
        return parsed && typeof parsed === "object" && !Array.isArray(parsed)
          ? parsed
          : {};
      }

      return {};
    } catch (error) {
      return {};
    }
  };

  const parseArray = (value) => {
    try {
      if (Array.isArray(value)) return value;

      if (typeof value === "string" && value.trim()) {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      }

      return [];
    } catch (error) {
      return [];
    }
  };

  const parsedProps = parseObject(props);
  const dataValue = parsedProps.data;
  const source = Array.isArray(dataValue)
    ? parseObject(dataValue[0])
    : dataValue && typeof dataValue === "object"
      ? parseObject(dataValue)
      : parsedProps;

  const defaultMessages = [
    {
      id: "RX-001",
      sender: "17번 정거장 관제실",
      frequency: "104.7 MHz",
      date: "5월 22일",
      time: "23:52",
      content:
        "북부 터널 진입로에서 비정상적인 움직임이 감지됐다. 현재 모든 라이더는 17번 정거장으로 복귀하라. 반복한다. 북부 터널 방면으로 접근하지 말 것.",
    },
  ];

  const parsedMessages = parseArray(source.messages);
  const messageSource =
    parsedMessages.length > 0 ? parsedMessages : defaultMessages;

  const messages = messageSource.map((message, index) => {
    const item = message && typeof message === "object" ? message : {};

    return {
      id: item.id ?? `RX-${String(index + 1).padStart(3, "0")}`,
      sender: item.sender || "발신자 미상",
      frequency: item.frequency || "주파수 미상",
      date: item.date || "날짜 없음",
      time: item.time || "시간 없음",
      content: item.content || "수신된 내용이 없습니다.",
    };
  });

  const [sendStatus, setSendStatus] = useState("");
  const firstMessage = messages[0] || defaultMessages[0];

  const stopEvent = (event) => {
    event?.stopPropagation?.();
  };

  const stopContainerEvent = (event) => {
    event?.stopPropagation?.();
  };

  const sendSafely = (text) => {
    let sender = null;

    try {
      if (typeof sendMessage === "function") {
        sender = sendMessage;
      }
    } catch (error) {
      sender = null;
    }

    if (
      !sender &&
      typeof globalThis !== "undefined" &&
      typeof globalThis.sendMessage === "function"
    ) {
      sender = globalThis.sendMessage;
    }

    if (!sender) {
      setSendStatus("응답 기능을 찾을 수 없습니다.");
      return false;
    }

    try {
      sender(text);
      setSendStatus("응답을 전송했습니다.");
      return true;
    } catch (error) {
      setSendStatus("응답 전송에 실패했습니다.");
      return false;
    }
  };

  const handleResponse = (event, message) => {
    stopEvent(event);

    const frequency = message?.frequency || "알 수 없는";
    sendSafely(`{{char}}가 ${frequency} 주파수에 응답한다.`);
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "2px",
        border: "1px solid #43513a",
        padding: "1px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "12px",
          height: "8px",
          backgroundColor: "#293521",
        }}
      />
      <div
        style={{
          width: "1px",
          height: "4px",
          backgroundColor: "#293521",
        }}
      />
    </div>
  );

  const Icon = ({ symbol, size = 13 }) => (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${Math.max(10, size - 1)}px`,
        fontWeight: 900,
        lineHeight: 1,
      }}
    >
      {symbol}
    </span>
  );

  const AudioWave = () => {
    const waveHeights = [
      6, 13, 9, 22, 15, 30, 12, 19, 34, 24, 10, 27, 38, 17, 29, 13, 23, 36, 19,
      8, 26, 32, 14, 21, 10, 28, 18, 7,
    ];

    return (
      <div
        style={{
          display: "flex",
          height: "48px",
          alignItems: "center",
          justifyContent: "center",
          gap: "3px",
          overflow: "hidden",
          borderTop: "1px dashed #647156",
          borderBottom: "1px dashed #647156",
          padding: "0 8px",
          boxSizing: "border-box",
        }}
      >
        {waveHeights.map((height, index) => (
          <span
            key={`${height}-${index}`}
            style={{
              width: "2px",
              height: `${Math.max(4, Math.round(height * 0.65))}px`,
              flexShrink: 0,
              backgroundColor: "#34422c",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      onClick={stopContainerEvent}
      onMouseDown={stopContainerEvent}
      onPointerDown={stopContainerEvent}
      style={{
        position: "relative",
        width: "100%",
        margin: "0 auto",
        padding: "32px 0",
        color: "#25301f",
        fontFamily:
          "Inter, Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        userSelect: "none",
        boxSizing: "border-box",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "48px",
          width: "8px",
          height: "48px",
          borderRadius: "999px 999px 0 0",
          backgroundColor: "#3a413a",
          boxShadow: "0 8px 14px rgba(0,0,0,0.28)",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "112px",
          right: "-4px",
          width: "16px",
          height: "144px",
          borderTop: "2px solid #272d27",
          borderRight: "2px solid #272d27",
          borderBottom: "2px solid #272d27",
          borderRadius: "0 12px 12px 0",
          backgroundColor: "#50564e",
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
              Radio Transmission Receiver
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
            NH-RX17
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
              minHeight: "400px",
              maxHeight: "520px",
              overflowX: "hidden",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
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
                  style={{
                    flexShrink: 0,
                    fontSize: "10px",
                    fontWeight: 900,
                  }}
                >
                  RX MODE
                </span>
                <span
                  style={{
                    height: "12px",
                    borderLeft: "1px solid #59664f",
                  }}
                />
                <span
                  style={{
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: 700,
                  }}
                >
                  {firstMessage.date} · {firstMessage.time}
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
                    <Icon symbol="◉" />
                    INCOMING TRANSMISSIONS
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
                    라디오 무전 수신
                  </h1>
                </div>

                <div
                  style={{
                    border: "2px solid #48563d",
                    padding: "4px 8px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "10px", fontWeight: 900 }}>
                    RECEIVED
                  </div>
                  <div
                    style={{
                      marginTop: "2px",
                      fontSize: "12px",
                      fontWeight: 900,
                    }}
                  >
                    {messages.length}
                  </div>
                </div>
              </div>
            </header>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  style={{
                    border: "2px solid #4c5a40",
                    backgroundColor: "#a3ae7d",
                    padding: "12px",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "12px",
                      paddingBottom: "8px",
                      borderBottom: "1px solid #647156",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        minWidth: 0,
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Icon symbol="◉" />
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 900,
                          letterSpacing: "0.1em",
                        }}
                      >
                        TRANSMISSION {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: "10px",
                        fontWeight: 900,
                      }}
                    >
                      {message.date} · {message.time}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      marginTop: "12px",
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
                      <Icon symbol="ϟ" size={16} />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "9px",
                            fontWeight: 900,
                            letterSpacing: "0.12em",
                            opacity: 0.7,
                          }}
                        >
                          ACTIVE FREQUENCY
                        </div>
                        <div
                          style={{
                            marginTop: "2px",
                            overflowWrap: "anywhere",
                            fontSize: "18px",
                            fontWeight: 900,
                            letterSpacing: "-0.04em",
                          }}
                        >
                          {message.frequency}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => handleResponse(event, message)}
                      onMouseDown={stopEvent}
                      onPointerDown={stopEvent}
                      style={{
                        display: "inline-flex",
                        minHeight: "36px",
                        flexShrink: 0,
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "7px 12px",
                        border: "2px solid #34422c",
                        borderRadius: "4px",
                        backgroundColor: "#d2a84f",
                        color: "#20281c",
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.28), 0 3px 0 #735a28, 0 0 10px rgba(210,168,79,0.3)",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: "10px",
                        fontWeight: "900",
                        letterSpacing: "0.08em",
                        lineHeight: 1,
                        textTransform: "uppercase",
                        touchAction: "manipulation",
                        WebkitTapHighlightColor: "transparent",
                        boxSizing: "border-box",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          fontSize: "13px",
                          fontWeight: "900",
                          lineHeight: 1,
                        }}
                      >
                        ϟ
                      </span>

                      <span>응답하기</span>

                      <span
                        aria-hidden="true"
                        style={{
                          fontSize: "11px",
                          lineHeight: 1,
                        }}
                      >
                        ▶
                      </span>
                    </button>
                  </div>

                  <div style={{ marginTop: "12px" }}>
                    <AudioWave />
                  </div>

                  <div
                    style={{
                      marginTop: "12px",
                      paddingBottom: "12px",
                      borderBottom: "1px solid #59664f",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "9px",
                        fontWeight: 900,
                        letterSpacing: "0.12em",
                        opacity: 0.65,
                      }}
                    >
                      TRANSMISSION SOURCE
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "4px",
                      }}
                    >
                      <Icon symbol="●" />
                      <span
                        style={{
                          overflowWrap: "anywhere",
                          fontSize: "13px",
                          fontWeight: 900,
                        }}
                      >
                        {message.sender}
                      </span>
                    </div>
                  </div>

                  <section style={{ paddingTop: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "8px",
                        fontSize: "10px",
                        fontWeight: 900,
                        letterSpacing: "0.1em",
                      }}
                    >
                      <Icon symbol="▤" />
                      DECODED MESSAGE
                    </div>
                    <div
                      style={{
                        position: "relative",
                        border: "2px solid #566449",
                        backgroundColor: "rgba(170,181,131,0.72)",
                        padding: "12px",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          whiteSpace: "pre-wrap",
                          overflowWrap: "anywhere",
                          fontSize: "12px",
                          fontWeight: 900,
                          lineHeight: 1.6,
                        }}
                      >
                        {message.content}
                      </p>
                    </div>
                  </section>
                </div>
              ))}
            </div>

            {sendStatus && (
              <div
                role="status"
                style={{
                  marginTop: "12px",
                  border: "1px dashed #526047",
                  backgroundColor: "rgba(163,174,125,0.68)",
                  padding: "8px 10px",
                  fontSize: "10px",
                  fontWeight: 900,
                  lineHeight: 1.5,
                }}
              >
                {sendStatus}
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                color: "#2b302b",
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Receive
            </span>
            <span
              style={{
                width: "10px",
                height: "10px",
                border: "1px solid #6f5c2e",
                borderRadius: "50%",
                backgroundColor: "#c79c4f",
                boxShadow: "0 0 7px rgba(199,156,79,0.42)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RadioTransmissionTerminal;
