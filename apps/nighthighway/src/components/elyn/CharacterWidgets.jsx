import { useState } from 'react';

function CharacterWidgets({
  data = null,
  characterName = "Noé Valenti",
  dateTime = "5월 22일 수요일 · 23:47",
  banking = null,
  messages = null,
  search = null,
  notes = null,
  gallery = null,
}) {
  const safeStop = (event) => {
    event?.stopPropagation?.();
  };

  const parseJSON = (value, fallback) => {
    try {
      if (typeof value !== "string") return value ?? fallback;
      if (!value.trim()) return fallback;
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  };

  const parsedData = parseJSON(data, null);
  const source = Array.isArray(parsedData)
    ? parsedData[0] && typeof parsedData[0] === "object"
      ? parsedData[0]
      : {}
    : parsedData && typeof parsedData === "object"
      ? parsedData
      : {};

  const resolvedCharacterName =
    source.characterName || characterName || "이름 없음";
  const resolvedDateTime = source.dateTime || dateTime || "시간 정보 없음";

  const defaultBanking = {
    balance: "2,450",
    history: [
      {
        id: 1,
        store: "17번 정거장 연료 보급",
        price: "-65",
        date: "22:14",
      },
      {
        id: 2,
        store: "북부 검문소 통행료",
        price: "-28",
        date: "19:05",
      },
      {
        id: 3,
        store: "장거리 운송 보수",
        price: "+320",
        date: "어젯밤",
      },
    ],
  };

  const defaultMessages = [
    {
      id: 1,
      sender: "정거장 17",
      text: "북쪽 터널이 다시 열렸어. 새벽 두 시 전까지만 통과 가능.",
      time: "23:31",
    },
    {
      id: 2,
      sender: "UNKNOWN",
      text: `${resolvedCharacterName}, 네가 찾던 사람이 서쪽 검문소를 지났다는 소문이 있어.`,
      time: "21:15",
    },
  ];

  const defaultSearch = [
    {
      id: 1,
      query: "17번 국도 북부 우회로",
      date: "10분 전",
    },
    {
      id: 2,
      query: "폐쇄된 도서관 지하 진입로",
      date: "1시간 전",
    },
  ];

  const defaultNotes = [
    {
      id: 1,
      title: "북부 우회로",
      content:
        "낡은 교량 직전에서 동쪽 관리도로로 진입. 흰색 삼각 표식은 거짓 표지일 가능성이 높다.",
      date: "05.20",
    },
    {
      id: 2,
      title: "보급 목록",
      content:
        "필터 두 개, 체인 오일, 붕대, 커피. 연료는 다음 정거장까지 충분함.",
      date: "05.18",
    },
  ];

  const defaultGallery = [
    {
      id: 1,
      desc: "비가 그친 밤, 폐주유소 지붕 아래 세워 둔 HEARSE와 멀리 켜진 정거장 불빛.",
      type: "ROAD MEMORY",
      time: "어젯밤 22:12",
    },
    {
      id: 2,
      desc: "지도 가장자리에 새로 그려 넣은 우회로와 알아보기 어려운 개인 표식.",
      type: "MAP RECORD",
      time: "화요일",
    },
  ];

  const asArray = (value, fallback) => {
    const parsed = parseJSON(value, null);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  };

  const rawBanking = parseJSON(source.banking ?? banking, null);
  const bankingData =
    rawBanking && typeof rawBanking === "object" && !Array.isArray(rawBanking)
      ? {
          balance: rawBanking.balance ?? defaultBanking.balance,
          history: Array.isArray(rawBanking.history)
            ? rawBanking.history
            : defaultBanking.history,
        }
      : defaultBanking;

  const messageList = asArray(source.messages ?? messages, defaultMessages).map(
    (item, index) => ({
      id: item?.id ?? `message-${index + 1}`,
      sender: item?.sender || "UNKNOWN",
      text: item?.text || "내용 없음",
      time: item?.time || "시간 정보 없음",
    }),
  );

  const searchList = asArray(source.search ?? search, defaultSearch).map(
    (item, index) => ({
      id: item?.id ?? `search-${index + 1}`,
      query: item?.query || "검색어 없음",
      date: item?.date || "시간 정보 없음",
    }),
  );

  const noteList = asArray(source.notes ?? notes, defaultNotes).map(
    (item, index) => ({
      id: item?.id ?? `note-${index + 1}`,
      title: item?.title || "제목 없는 기록",
      content: item?.content || "내용 없음",
      date: item?.date || "날짜 없음",
    }),
  );

  const galleryList = asArray(source.gallery ?? gallery, defaultGallery).map(
    (item, index) => ({
      id: item?.id ?? `gallery-${index + 1}`,
      desc: item?.desc || "기록 내용 없음",
      type: item?.type || "ROAD MEMORY",
      time: item?.time || "시간 정보 없음",
    }),
  );

  const bankingHistory = (
    Array.isArray(bankingData.history) ? bankingData.history : []
  ).map((item, index) => ({
    id: item?.id ?? `transaction-${index + 1}`,
    store: item?.store || "거래처 정보 없음",
    price: item?.price || "0",
    date: item?.date || "시간 정보 없음",
  }));

  const [activeTab, setActiveTab] = useState(null);

  const tabs = [
    {
      id: "banking",
      number: "01",
      title: "보급 장부",
      shortTitle: "CREDIT",
      symbol: "▣",
    },
    {
      id: "messages",
      number: "02",
      title: "수신 무전",
      shortTitle: "RADIO",
      symbol: "◉",
    },
    {
      id: "search",
      number: "03",
      title: "경로 검색",
      shortTitle: "ROUTE",
      symbol: "⌖",
    },
    {
      id: "notes",
      number: "04",
      title: "현장 기록",
      shortTitle: "NOTES",
      symbol: "▤",
    },
    {
      id: "gallery",
      number: "05",
      title: "도로 기억",
      shortTitle: "MEMORY",
      symbol: "★",
    },
  ];

  const activeMeta = tabs.find((tab) => tab.id === activeTab) || null;

  const openTab = (event, tabId) => {
    safeStop(event);
    setActiveTab(tabId);
  };

  const closeTab = (event) => {
    safeStop(event);
    setActiveTab(null);
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
        style={{
          width: "2px",
          height: "6px",
          backgroundColor: "#35432e",
        }}
      />
    </div>
  );

  const LCDTopBar = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        borderBottom: "2px solid #48563d",
        paddingBottom: "6px",
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
            letterSpacing: "0.08em",
          }}
        >
          NH-09
        </span>
        <span style={{ height: "12px", borderLeft: "1px solid #59664f" }} />
        <span
          style={{
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "11px",
            fontWeight: 700,
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
  );

  const MenuTile = ({ id, number, title, symbol, children, wide = false }) => {
    return (
      <button
        type="button"
        onClick={(event) => openTab(event, id)}
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          minHeight: wide ? "102px" : "112px",
          gridColumn: wide ? "1 / -1" : "auto",
          flexDirection: "column",
          border: "2px solid #49583e",
          backgroundColor: "rgba(174,185,132,0.68)",
          padding: "10px",
          color: "#25301f",
          textAlign: "left",
          fontFamily: "inherit",
          fontSize: "11px",
          cursor: "pointer",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              aria-hidden="true"
              style={{ fontSize: "14px", fontWeight: 900 }}
            >
              {symbol}
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: "0.08em",
              }}
            >
              {number}
            </span>
          </div>
          <span
            aria-hidden="true"
            style={{
              fontSize: "15px",
              transform: "none",
            }}
          >
            ›
          </span>
        </div>

        <div
          style={{
            marginTop: "8px",
            fontSize: "11px",
            fontWeight: 900,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>

        <div style={{ marginTop: "auto", paddingTop: "8px", fontSize: "11px" }}>
          {children}
        </div>
      </button>
    );
  };

  const DetailTitle = () => (
    <div
      style={{
        marginBottom: "12px",
        borderBottom: "2px solid #46543c",
        paddingBottom: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
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
          <span aria-hidden="true" style={{ flexShrink: 0, fontSize: "16px" }}>
            {activeMeta?.symbol || "▤"}
          </span>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: "0.1em",
              }}
            >
              FILE {activeMeta?.number || "--"}
            </div>
            <h2
              style={{
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "14px",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              {activeMeta?.title || "파일 없음"}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={closeTab}
          style={{
            display: "flex",
            height: "32px",
            flexShrink: 0,
            alignItems: "center",
            gap: "4px",
            border: "2px solid #46543c",
            backgroundColor: "#a4b07c",
            padding: "0 8px",
            color: "#25301f",
            fontFamily: "inherit",
            fontSize: "10px",
            fontWeight: 900,
            cursor: "pointer",
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
            boxSizing: "border-box",
          }}
        >
          <span aria-hidden="true">×</span>
          BACK
        </button>
      </div>
    </div>
  );

  const LCDListRow = ({ title, subtitle, value, positive = false }) => (
    <div
      style={{
        borderBottom: "1px dashed #5b684f",
        padding: "10px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "11px",
              fontWeight: 900,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                marginTop: "2px",
                fontSize: "11px",
                fontWeight: 700,
                opacity: 0.7,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
        {value ? (
          <div
            style={{
              flexShrink: 0,
              fontSize: "11px",
              fontWeight: 900,
              textDecoration: positive ? "underline" : "none",
              textDecorationThickness: positive ? "2px" : undefined,
              textUnderlineOffset: positive ? "2px" : undefined,
            }}
          >
            {value}
          </div>
        ) : null}
      </div>
    </div>
  );

  const lineClampStyle = (lines) => ({
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: lines,
    overflow: "hidden",
  });

  const renderHome = () => (
    <>
      <LCDTopBar />

      <div style={{ padding: "12px 0" }}>
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
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: "0.12em",
              }}
            >
              RIDER IDENTIFICATION
            </div>
            <h1
              style={{
                margin: "4px 0 0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "19px",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.05em",
                textTransform: "uppercase",
              }}
            >
              {resolvedCharacterName}
            </h1>
            <div
              style={{ marginTop: "6px", fontSize: "10px", fontWeight: 700 }}
            >
              CALL SIGN: COYOTE
            </div>
          </div>

          <div
            style={{
              flexShrink: 0,
              border: "2px solid #47553d",
              padding: "4px 8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: 900 }}>STATUS</div>
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
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#2d3926",
                  boxShadow: "0 0 5px rgba(45,57,38,0.5)",
                }}
              />
              ACTIVE
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <span
          style={{ fontSize: "10px", fontWeight: 900, letterSpacing: "0.1em" }}
        >
          DIRECTORY
        </span>
        <div style={{ height: "1px", flex: 1, backgroundColor: "#506044" }} />
        <span style={{ fontSize: "10px", fontWeight: 700 }}>5 FILES</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "8px",
        }}
      >
        <MenuTile id="banking" number="01" title="보급 장부" symbol="▣">
          <div style={{ fontSize: "10px", fontWeight: 900, opacity: 0.7 }}>
            CREDIT
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "4px",
              marginTop: "2px",
            }}
          >
            <span
              style={{
                fontSize: "17px",
                fontWeight: 900,
                letterSpacing: "-0.05em",
              }}
            >
              {bankingData.balance ?? "0"}
            </span>
            <span style={{ fontSize: "10px", fontWeight: 900 }}>CR</span>
          </div>
        </MenuTile>

        <MenuTile id="messages" number="02" title="수신 무전" symbol="◉">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "10px",
              fontWeight: 900,
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#2f3c28",
              }}
            />
            NEW SIGNAL
          </div>
          <p
            style={{
              ...lineClampStyle(2),
              margin: "4px 0 0",
              fontSize: "11px",
              fontWeight: 700,
              lineHeight: 1.35,
            }}
          >
            {messageList[0]?.sender}: {messageList[0]?.text}
          </p>
        </MenuTile>

        <MenuTile id="search" number="03" title="경로 검색" symbol="⌖">
          <div style={{ fontSize: "10px", fontWeight: 900, opacity: 0.7 }}>
            LAST QUERY
          </div>
          <p
            style={{
              ...lineClampStyle(2),
              margin: "4px 0 0",
              fontSize: "11px",
              fontWeight: 700,
              lineHeight: 1.35,
            }}
          >
            {searchList[0]?.query}
          </p>
        </MenuTile>

        <MenuTile id="notes" number="04" title="현장 기록" symbol="▤">
          <div style={{ fontSize: "10px", fontWeight: 900, opacity: 0.7 }}>
            RECENT NOTE
          </div>
          <p
            style={{
              margin: "4px 0 0",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "11px",
              fontWeight: 900,
            }}
          >
            {noteList[0]?.title}
          </p>
          <p
            style={{
              ...lineClampStyle(1),
              margin: "2px 0 0",
              fontSize: "11px",
            }}
          >
            {noteList[0]?.content}
          </p>
        </MenuTile>

        <MenuTile id="gallery" number="05" title="도로 기억" symbol="★" wide>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: "10px", fontWeight: 900, opacity: 0.7 }}>
                {galleryList[0]?.type}
              </div>
              <p
                style={{
                  ...lineClampStyle(2),
                  margin: "4px 0 0",
                  fontSize: "11px",
                  fontWeight: 700,
                  lineHeight: 1.35,
                }}
              >
                {galleryList[0]?.desc}
              </p>
            </div>
            <span style={{ flexShrink: 0, fontSize: "11px", fontWeight: 900 }}>
              {galleryList[0]?.time}
            </span>
          </div>
        </MenuTile>
      </div>
    </>
  );

  const renderDetail = () => (
    <>
      <LCDTopBar />
      <div style={{ paddingTop: "12px" }}>
        <DetailTitle />

        {activeTab === "banking" ? (
          <div>
            <div
              style={{
                marginBottom: "12px",
                border: "2px solid #46543c",
                backgroundColor: "#a4af7d",
                padding: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                }}
              >
                AVAILABLE ROUTE CREDIT
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "4px",
                  marginTop: "4px",
                }}
              >
                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: 900,
                    letterSpacing: "-0.07em",
                  }}
                >
                  {bankingData.balance ?? "0"}
                </span>
                <span style={{ fontSize: "10px", fontWeight: 900 }}>CR</span>
              </div>
            </div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: "0.1em",
              }}
            >
              TRANSACTION LOG
            </div>
            <div style={{ marginTop: "4px" }}>
              {bankingHistory.length > 0 ? (
                bankingHistory.map((item) => (
                  <LCDListRow
                    key={item.id}
                    title={item.store}
                    subtitle={item.date}
                    value={item.price}
                    positive={String(item.price).includes("+")}
                  />
                ))
              ) : (
                <div
                  style={{
                    padding: "14px 0",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  거래 기록이 없습니다.
                </div>
              )}
            </div>
          </div>
        ) : null}

        {activeTab === "messages" ? (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                }}
              >
                RECEIVED SIGNALS
              </span>
              <span style={{ fontSize: "10px", fontWeight: 900 }}>
                {messageList.length} MSG
              </span>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {messageList.map((message) => (
                <article
                  key={message.id}
                  style={{
                    border: "2px solid #48573e",
                    backgroundColor: "rgba(167,179,127,0.58)",
                    padding: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                      borderBottom: "1px dashed #5c6950",
                      paddingBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "11px",
                        fontWeight: 900,
                      }}
                    >
                      FROM: {message.sender}
                    </span>
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {message.time}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: "11px",
                      fontWeight: 700,
                      lineHeight: 1.6,
                    }}
                  >
                    {message.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "search" ? (
          <div>
            <div
              style={{
                marginBottom: "8px",
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: "0.1em",
              }}
            >
              RECENT ROUTE QUERIES
            </div>
            {searchList.map((searchItem, index) => (
              <div
                key={searchItem.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  borderBottom: "1px dashed #5b684f",
                  padding: "10px 0",
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
                    border: "2px solid #49583f",
                    fontSize: "10px",
                    fontWeight: 900,
                    boxSizing: "border-box",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: "11px",
                      fontWeight: 900,
                    }}
                  >
                    {searchItem.query}
                  </div>
                  <div
                    style={{
                      marginTop: "2px",
                      fontSize: "11px",
                      fontWeight: 700,
                      opacity: 0.7,
                    }}
                  >
                    {searchItem.date}
                  </div>
                </div>
                <span
                  aria-hidden="true"
                  style={{ flexShrink: 0, fontSize: "15px" }}
                >
                  ›
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {activeTab === "notes" ? (
          <div>
            <div
              style={{
                marginBottom: "8px",
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: "0.1em",
              }}
            >
              FIELD RECORDS
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {noteList.map((note) => (
                <article
                  key={note.id}
                  style={{
                    border: "2px solid #4b593f",
                    backgroundColor: "rgba(167,179,127,0.48)",
                    padding: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <h3
                      style={{ margin: 0, fontSize: "11px", fontWeight: 900 }}
                    >
                      {note.title}
                    </h3>
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {note.date}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: "11px",
                      fontWeight: 700,
                      lineHeight: 1.6,
                    }}
                  >
                    {note.content}
                  </p>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "gallery" ? (
          <div>
            <div
              style={{
                marginBottom: "8px",
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: "0.1em",
              }}
            >
              STORED ROAD MEMORIES
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {galleryList.map((galleryItem, index) => (
                <article
                  key={galleryItem.id}
                  style={{
                    position: "relative",
                    borderLeft: "2px solid #48573e",
                    paddingLeft: "12px",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "-5px",
                      top: 0,
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#33402b",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "11px",
                        fontWeight: 900,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")} · {galleryItem.type}
                    </span>
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {galleryItem.time}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: "11px",
                      fontWeight: 700,
                      lineHeight: 1.6,
                    }}
                  >
                    “{galleryItem.desc}”
                  </p>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );

  const rootEventProps = {
    onClick: safeStop,
  };

  return (
    <div
      {...rootEventProps}
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
          boxShadow: "inset 2px 0 0 rgba(255,255,255,0.05)",
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
          border: "2px solid #252a25",
          borderRadius: "34px",
          backgroundColor: "#555b52",
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.055), transparent 25%), linear-gradient(135deg, rgba(255,255,255,0.025), transparent 45%)",
          padding: "16px",
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
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.35)",
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
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Long Range Rider Pager
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
            NH-P17
          </div>
        </div>

        <div
          style={{
            border: "2px solid #222722",
            borderRadius: "20px",
            backgroundColor: "#171b18",
            padding: "8px",
            boxShadow: "inset 0 3px 9px rgba(0,0,0,0.75)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "relative",
              minHeight: "464px",
              overflow: "hidden",
              border: "1px solid #788262",
              borderRadius: "11px",
              backgroundColor: "#b4bf88",
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(42,53,34,0.045) 0px, rgba(42,53,34,0.045) 1px, transparent 1px, transparent 3px), radial-gradient(circle at 50% 30%, rgba(255,255,220,0.14), transparent 65%)",
              padding: "12px",
              color: "#25301f",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: "11px",
              boxShadow:
                "inset 0 0 18px rgba(48,62,36,0.35), 0 0 12px rgba(166,185,119,0.16)",
              boxSizing: "border-box",
            }}
          >
            <div style={{ position: "relative", zIndex: 1 }}>
              {activeTab ? renderDetail() : renderHome()}
            </div>
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-64px",
                right: "-56px",
                width: "160px",
                height: "192px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.055)",
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
                color: "#2c312c",
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: "0.12em",
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
              {Array.from({ length: 24 }).map((_, index) => (
                <span
                  key={index}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#252a25",
                    boxShadow: "inset 0 1px 1px rgba(0,0,0,0.65)",
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ position: "relative", width: "68px", height: "68px" }}>
            {[
              {
                key: "up",
                text: "▲",
                style: {
                  left: "50%",
                  top: 0,
                  transform: "translateX(-50%)",
                  borderRadius: "5px 5px 0 0",
                },
              },
              {
                key: "down",
                text: "▼",
                style: {
                  left: "50%",
                  bottom: 0,
                  transform: "translateX(-50%)",
                  borderRadius: "0 0 5px 5px",
                },
              },
              {
                key: "left",
                text: "◀",
                style: {
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  borderRadius: "5px 0 0 5px",
                },
              },
              {
                key: "right",
                text: "▶",
                style: {
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  borderRadius: "0 5px 5px 0",
                },
              },
            ].map((pad) => (
              <div
                key={pad.key}
                style={{
                  position: "absolute",
                  display: "flex",
                  width: "28px",
                  height: "28px",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #272c27",
                  backgroundColor: "#434942",
                  color: "#1f241f",
                  fontSize: "10px",
                  boxShadow:
                    "inset 1px 1px 0 rgba(255,255,255,0.05), 2px 3px 5px rgba(0,0,0,0.3)",
                  boxSizing: "border-box",
                  ...pad.style,
                }}
              >
                {pad.text}
              </div>
            ))}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                display: "flex",
                width: "28px",
                height: "28px",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #252a25",
                borderRadius: "50%",
                backgroundColor: "#353b35",
                color: "#1d221d",
                fontSize: "10px",
                fontWeight: 900,
                transform: "translate(-50%, -50%)",
                boxSizing: "border-box",
              }}
            >
              OK
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  color: "#2b302b",
                  fontSize: "10px",
                  fontWeight: 900,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Signal
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
            <button
              type="button"
              onClick={closeTab}
              style={{
                border: "1px solid #292e29",
                borderRadius: "6px",
                backgroundColor: "#3d433d",
                padding: "8px 12px",
                color: "#1c211c",
                fontFamily: "inherit",
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
                boxShadow:
                  "inset 1px 1px 0 rgba(255,255,255,0.05), 2px 3px 5px rgba(0,0,0,0.3)",
              }}
            >
              Menu
            </button>
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
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Station Relay Compatible
          </span>
          <span
            style={{
              color: "#303630",
              fontSize: "10px",
              fontWeight: 900,
              letterSpacing: "0.1em",
              textAlign: "right",
              textTransform: "uppercase",
            }}
          >
            Property of Rider
          </span>
        </div>
      </div>
    </div>
  );
}

export default CharacterWidgets;
