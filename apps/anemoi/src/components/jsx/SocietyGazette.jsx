import { useState } from 'react';

function SocietyGazette(props = {}) {
  const {
    issueTitle = "THE ANEMOI GAZETTE",
    issueSubtitle = "황도 사교계 주간지",
    issueNo = "No. 27",
    date = "5월 3일 화요일",
    price = "2 PENNIES",
    editorNote = "황도의 응접실과 무도회장을 오가는 가장 빠른 소문.",
    headline = {
      kicker: "금주의 대서특필",
      kaomoji: "( ˘ ³˘)♥(˘︶˘ )",
      title: "에버우드의 사냥개, 봄 무도회에서 뜻밖의 동행",
      summary:
        "평소 연회장을 오래 지키지 않는 것으로 유명한 라파엘 에르덴 경이 한 인물과 나란히 정원을 걷는 모습이 목격되었다.",
      body:
        "목격자들은 두 사람이 공식적인 소개 이상의 친밀함을 보였다고 입을 모았다. 다만 에르덴 경은 질문을 받자 평소와 다름없는 태도로 웃어넘겼으며, 동행인의 신원에 대해서는 어떠한 언급도 하지 않았다.",
      byline: "사교부 특별 취재",
      comments: [
        { name: "장미온실의 참새", text: "저 둘이 정말 산책만 했다고 믿는 사람이 있나요?", hearts: 24 },
        { name: "서쪽 회랑의 목격자", text: "에르덴 경이 먼저 기다리고 있었다는 점이 중요합니다.", hearts: 17 },
      ],
    },
    sightings = [
      {
        title: "서쪽 회랑에서의 짧은 대화",
        text: "자정 무렵, 두 인물이 사람들의 시선을 피해 창가에서 한동안 대화를 나누는 모습이 포착되었다.",
        source: "익명의 백작부인",
        comments: [
          { name: "푸른 부채", text: "창가에서 그렇게 오래 이야기했다면 짧은 대화는 아니었겠군요.", hearts: 11 },
        ],
      },
      {
        title: "마차가 떠난 뒤에도 남은 사람",
        text: "행사가 끝난 뒤 에르덴 경이 평소보다 늦게 저택을 떠났다는 증언이 이어졌다.",
        source: "하인들의 전언",
        comments: [
          { name: "마차 번호를 세는 사람", text: "평소보다 늦게 떠났다는 증언이 둘 이상이면 꽤 흥미롭네요.", hearts: 8 },
        ],
      },
    ],
    anonymousTips = [
      {
        title: "“그 장갑은 누구의 것인가?”",
        text: "최근 에르덴 경의 사냥 장비 사이에서 본인의 취향과는 다른 색의 장갑이 발견되었다는 제보.",
        credibility: "신빙성 보통",
        comments: [
          { name: "레이스 장갑 수집가", text: "색까지 다르다면 주인이 따로 있을 가능성은 있겠죠.", hearts: 13 },
        ],
      },
      {
        title: "황궁 남쪽 정원의 두 그림자",
        text: "늦은 오후, 경비 교대 직전 두 사람이 같은 길을 여러 차례 걸었다는 익명 보고.",
        credibility: "확인 중",
        comments: [
          { name: "남쪽 정원 산책객", text: "경비 교대 시간까지 정확하다니 제보자가 더 수상한데요.", hearts: 19 },
        ],
      },
    ],
    scandals = [
      {
        pair: "라파엘 에르덴 × 미상",
        rumor: "단순한 호기심인가, 오래 끌 연애의 시작인가.",
        heat: 4,
        comments: [
          { name: "왈츠 세 곡째", text: "호기심치고는 시선이 너무 오래 머물렀다는 말이 있던데요.", hearts: 31 },
        ],
      },
      {
        pair: "벨로아 후작 영애 × 북부 공작 차남",
        rumor: "세 번째 춤까지 함께했다는 이유만으로 혼담설이 번지는 중.",
        heat: 3,
        comments: [
          { name: "혼담은 아직 이르다", text: "세 번째 춤만으로 약혼까지 가는 건 황도 사람들이 너무 성급합니다.", hearts: 14 },
        ],
      },
    ],
    marriageRumors = [
      {
        names: "에르덴 공작가 장남",
        text: "공작부인이 다시 한 번 황도 체류 기간 동안 적절한 혼처를 물색하고 있다는 소문.",
        status: "가문 측 확인 없음",
        comments: [
          { name: "공작부인의 찻잔", text: "가문 측 확인 없음이라는 말이 제일 무서운 법이지요.", hearts: 27 },
        ],
      },
      {
        names: "로렌시아 백작 영애",
        text: "남부의 해운 귀족가와 비공식적인 조건 조율이 시작되었다는 말이 돈다.",
        status: "가능성 높음",
        comments: [
          { name: "남부에서 온 편지", text: "조건 조율이라면 적어도 첫 만남은 끝났다는 뜻 아닐까요?", hearts: 9 },
        ],
      },
    ],
    societyExtras = {
      ballroomBackstage: [
        {
          title: "세 번째 왈츠가 끝난 뒤",
          text: "한 귀족 영애가 파트너를 바꾸지 않고 같은 상대와 네 번째 곡까지 남았다는 사실이 작은 파문을 일으켰다.",
        },
        {
          title: "샴페인 테이블의 빈자리",
          text: "평소 가장 먼저 자리를 차지하던 인물이 이날만큼은 정원 쪽 창가를 오래 비우지 않았다는 후문.",
        },
      ],
      weeklyBets: [
        {
          question: "다음 무도회에서 먼저 춤을 청할 사람은?",
          options: [
            { label: "라파엘", odds: "2 : 1" },
            { label: "상대방", odds: "3 : 1" },
            { label: "아무도 안 함", odds: "5 : 1" },
          ],
        },
      ],
      capitalPhrases: [
        {
          phrase: "“정원 쪽으로 나가실래요?”",
          meaning: "대놓고 말하지 않고 조용히 둘만의 대화를 제안할 때 쓰는 이번 주의 유행어.",
        },
        {
          phrase: "“그건 우연이었겠죠.”",
          meaning: "누구도 우연이라고 믿지 않을 때 가장 자주 등장하는 사교계식 회피 문구.",
        },
      ],
    },
    reputations = [
      {
        name: "라파엘 에르덴",
        label: "황실의 사냥개",
        score: 82,
        summary: "매력적이나 붙잡히지 않는 남자. 신뢰도는 높고 혼인 적합도 평가는 극단적으로 갈린다.",
        tags: ["인기", "위험", "황실 신임"],
        comments: [
          { name: "황도 관전자", text: "혼인 적합도보다 붙잡히지 않는다는 평이 더 정확해 보입니다.", hearts: 21 },
        ],
      },
      {
        name: "User",
        label: "최근 주목 인물",
        score: 71,
        summary: "최근 여러 상류층 모임에서 반복적으로 이름이 언급되고 있다. 신원보다 인간관계가 먼저 화제가 되는 중.",
        tags: ["화제", "관심 집중"],
        comments: [
          { name: "익명의 독자", text: "이름보다 누구와 함께 있었는지가 먼저 실리는 사람은 드물죠.", hearts: 15 },
        ],
      },
    ],
  } = props;

  const [activeSection, setActiveSection] = useState(null);

  const palette = {
    paper: "#e9e0cf",
    paperLight: "#f3ecdf",
    ink: "#17110c",
    inkSoft: "#34291f",
    line: "rgba(23,17,12,0.26)",
    lineStrong: "rgba(23,17,12,0.56)",
    accent: "#5f4727",
    muted: "#5a4d3e",
  };

  const fontStack =
    "'Gowun Batang', 'MaruBuri', 'Hahmlet', 'Nanum Myeongjo', 'Noto Serif KR', 'AppleMyungjo', serif";
  const displayStack =
    "'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', 'Times New Roman', 'Noto Serif KR', serif";

  const normalizeList = (value, fallback = []) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : fallback;
      } catch (error) {
        return fallback;
      }
    }
    return fallback;
  };

  const safeSightings = normalizeList(sightings);
  const safeTips = normalizeList(anonymousTips);
  const safeScandals = normalizeList(scandals);
  const safeMarriage = normalizeList(marriageRumors);
  const safeReputations = normalizeList(reputations);
  const safeBallroomBackstage = normalizeList(societyExtras?.ballroomBackstage);
  const safeWeeklyBets = normalizeList(societyExtras?.weeklyBets);
  const safeCapitalPhrases = normalizeList(societyExtras?.capitalPhrases);

  const stopEvent = (event) => event?.stopPropagation?.();

  const Rule = ({ thickness = 1, margin = "8px 0", color = palette.lineStrong }) => (
    <div aria-hidden="true" style={{ height: `${thickness}px`, backgroundColor: color, margin }} />
  );

  const MastRule = ({ margin = "6px 0" }) => (
    <div aria-hidden="true" style={{ margin }}>
      <div style={{ height: "3px", backgroundColor: palette.ink }} />
      <div style={{ height: "1px", backgroundColor: palette.ink, marginTop: "2px" }} />
    </div>
  );

  const SectionButton = ({ id, eyebrow, title, preview, noTopBorder = false }) => (
    <button
      type="button"
      onClick={(event) => {
        stopEvent(event);
        setActiveSection(id);
      }}
      style={{
        width: "100%",
        padding: "10px 0",
        border: "none",
        borderTop: noTopBorder ? "none" : `1px solid ${palette.line}`,
        background: "transparent",
        textAlign: "left",
        cursor: "pointer",
        fontFamily: "inherit",
        color: palette.ink,
      }}
    >
      <div
        style={{
          marginBottom: "3px",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.16em",
          color: palette.accent,
        }}
      >
        {eyebrow}
      </div>
      <div style={{ fontSize: "12px", fontWeight: 700, lineHeight: 1.45 }}>
        {title}
      </div>
      <div
        style={{
          marginTop: "3px",
          fontSize: "11px",
          fontWeight: 600,
          lineHeight: 1.55,
          color: palette.inkSoft,
        }}
      >
        {preview}
      </div>
    </button>
  );

  const KaomojiPhoto = ({ value }) => (
    <div
      aria-label="헤드라인 삽화"
      style={{
        width: "100%",
        maxWidth: "300px",
        margin: "0 auto 9px",
        padding: "14px 12px 12px",
        borderTop: `1px solid ${palette.lineStrong}`,
        borderBottom: `1px solid ${palette.lineStrong}`,
        backgroundColor: "rgba(255,255,255,0.13)",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "19px",
          fontWeight: 700,
          letterSpacing: "0.03em",
          lineHeight: 1.25,
          color: palette.ink,
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
        }}
      >
        {value || "( ˘ ³˘)♥(˘︶˘ )"}
      </div>
      <div
        style={{
          marginTop: "7px",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: palette.muted,
        }}
      >
        SOCIETY SKETCH
      </div>
    </div>
  );

  const BackButton = () => (
    <button
      type="button"
      onClick={(event) => {
        stopEvent(event);
        setActiveSection(null);
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 0",
        marginBottom: "10px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: palette.inkSoft,
      }}
    >
      <span aria-hidden="true">←</span>
      <span>신문 1면으로</span>
    </button>
  );

  const ArticleTitle = ({ label, title }) => (
    <div style={{ marginBottom: "10px", textAlign: "left" }}>
      <div
        style={{
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.16em",
          color: palette.accent,
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: "3px",
          fontFamily: displayStack,
          fontSize: "22px",
          fontWeight: 800,
          lineHeight: 1.25,
          letterSpacing: "-0.005em",
          color: palette.ink,
        }}
      >
        {title}
      </div>
      <Rule thickness={2} margin="8px 0 0" color={palette.ink} />
    </div>
  );

  const HeatHearts = ({ value = 0 }) => {
    const safeHeat = Math.max(0, Math.min(5, Number(value) || 0));

    return (
      <span
        aria-label={`염문 지수 ${safeHeat}/5`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "2px",
          verticalAlign: "middle",
          whiteSpace: "nowrap",
        }}
      >
        {[1, 2, 3, 4, 5].map((heart) => (
          <span
            key={heart}
            aria-hidden="true"
            style={{
              fontSize: "11px",
              lineHeight: 1,
              color: heart <= safeHeat ? palette.accent : "rgba(23,17,12,0.18)",
            }}
          >
            ♥
          </span>
        ))}
      </span>
    );
  };

  const ReaderComments = ({ comments }) => {
    const items = normalizeList(comments);

    if (items.length === 0) return null;

    return (
      <div
        style={{
          marginTop: "10px",
          paddingTop: "9px",
          borderTop: `1px dotted ${palette.lineStrong}`,
        }}
      >
        <div
          style={{
            marginBottom: "7px",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.1em",
            color: palette.accent,
          }}
        >
          독자들의 한마디
        </div>

        <div style={{ display: "grid", gap: "7px" }}>
          {items.map((comment, index) => (
            <div
              key={`${comment?.name || "reader"}-${index}`}
              style={{
                padding: "7px 8px",
                borderLeft: `2px solid ${palette.lineStrong}`,
                backgroundColor: "rgba(255,255,255,0.12)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  fontSize: "11px",
                  lineHeight: 1.4,
                }}
              >
                <span style={{ fontWeight: 800, color: palette.ink }}>
                  {comment?.name || "익명의 독자"}
                </span>
                <span style={{ flexShrink: 0, fontWeight: 800, color: palette.accent }}>
                  ♥ {Math.max(0, Number(comment?.hearts) || 0)}
                </span>
              </div>

              <div
                style={{
                  marginTop: "3px",
                  fontSize: "11px",
                  fontWeight: 600,
                  lineHeight: 1.6,
                  color: palette.inkSoft,
                  overflowWrap: "anywhere",
                  wordBreak: "keep-all",
                }}
              >
                “{comment?.text || "내용 없음"}”
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const DetailList = ({ items, renderItem }) => (
    <div>
      {items.map((item, index) => (
        <div
          key={`${index}-${item?.title || item?.name || item?.pair || item?.names || "item"}`}
          style={{
            padding: index === 0 ? "2px 0 10px" : "10px 0",
            borderTop: index === 0 ? "none" : `1px solid ${palette.line}`,
          }}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );

  const ReputationBar = ({ score = 0 }) => {
    const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
    return (
      <div style={{ position: "relative", height: "5px", marginTop: "6px", backgroundColor: "rgba(42,33,24,0.10)" }}>
        <div style={{ width: `${safeScore}%`, height: "100%", backgroundColor: palette.accent }} />
      </div>
    );
  };

  const renderDetail = () => {
    if (activeSection === "headline") {
      const bodyText = headline?.body || "본문 없음";
      const firstChar = bodyText.charAt(0);
      const restOfBody = bodyText.slice(1);

      return (
        <div>
          <BackButton />
          <KaomojiPhoto value={headline?.kaomoji} />
          <ArticleTitle label={headline?.kicker || "금주의 대서특필"} title={headline?.title || "제목 없음"} />
          <div style={{ marginBottom: "6px", fontSize: "11px", fontWeight: 700, lineHeight: 1.6, color: palette.ink }}>
            {headline?.summary || "요약 없음"}
          </div>
          <div
            style={{
              marginBottom: "10px",
              textAlign: "left",
              fontSize: "10.5px",
              fontStyle: "italic",
              fontWeight: 600,
              color: palette.muted,
            }}
          >
            {headline?.byline || "사교부"} · {date}
          </div>
          <div style={{ fontSize: "11px", lineHeight: 1.75, color: palette.inkSoft, textAlign: "justify" }}>
            <span
              aria-hidden="true"
              style={{
                float: "left",
                fontFamily: displayStack,
                fontSize: "40px",
                fontWeight: 800,
                lineHeight: "34px",
                marginRight: "6px",
                marginTop: "2px",
                color: palette.ink,
              }}
            >
              {firstChar}
            </span>
            {restOfBody}
          </div>
          <ReaderComments comments={headline?.comments} />
        </div>
      );
    }

    if (activeSection === "sightings") {
      return (
        <div>
          <BackButton />
          <ArticleTitle title="목격담" />
          <DetailList
            items={safeSightings}
            renderItem={(item) => (
              <>
                <div style={{ fontSize: "12px", fontWeight: 700, color: palette.ink }}>{item?.title || "제목 없음"}</div>
                <div style={{ marginTop: "4px", fontSize: "11px", lineHeight: 1.65, color: palette.inkSoft }}>{item?.text || "내용 없음"}</div>
                <div style={{ marginTop: "4px", fontSize: "11px", fontStyle: "italic", color: palette.muted }}>출처: {item?.source || "익명"}</div>
                <ReaderComments comments={item?.comments} />
              </>
            )}
          />
        </div>
      );
    }

    if (activeSection === "tips") {
      return (
        <div>
          <BackButton />
          <ArticleTitle title="익명 제보" />
          <DetailList
            items={safeTips}
            renderItem={(item) => (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: palette.ink }}>{item?.title || "제목 없음"}</div>
                  <div style={{ flexShrink: 0, fontSize: "11px", fontWeight: 700, color: palette.accent }}>{item?.credibility || "확인 중"}</div>
                </div>
                <div style={{ marginTop: "4px", fontSize: "11px", lineHeight: 1.65, color: palette.inkSoft }}>{item?.text || "내용 없음"}</div>
                <ReaderComments comments={item?.comments} />
              </>
            )}
          />
        </div>
      );
    }

    if (activeSection === "scandals") {
      return (
        <div>
          <BackButton />
          <ArticleTitle title="이번 주 염문" />
          <DetailList
            items={safeScandals}
            renderItem={(item) => (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: palette.ink }}>{item?.pair || "인물 미상"}</div>
                  <HeatHearts value={item?.heat} />
                </div>
                <div style={{ marginTop: "4px", fontSize: "11px", lineHeight: 1.65, color: palette.inkSoft }}>{item?.rumor || "소문 없음"}</div>
                <ReaderComments comments={item?.comments} />
              </>
            )}
          />
        </div>
      );
    }

    if (activeSection === "marriage") {
      return (
        <div>
          <BackButton />
          <ArticleTitle title="혼담 소문" />
          <DetailList
            items={safeMarriage}
            renderItem={(item) => (
              <>
                <div style={{ fontSize: "12px", fontWeight: 700, color: palette.ink }}>{item?.names || "인물 미상"}</div>
                <div style={{ marginTop: "4px", fontSize: "11px", lineHeight: 1.65, color: palette.inkSoft }}>{item?.text || "내용 없음"}</div>
                <div style={{ marginTop: "4px", fontSize: "11px", fontWeight: 700, color: palette.accent }}>{item?.status || "미확인"}</div>
                <ReaderComments comments={item?.comments} />
              </>
            )}
          />
        </div>
      );
    }

    if (activeSection === "reputation") {
      return (
        <div>
          <BackButton />
          <ArticleTitle title="사교계 인물 평판" />
          <DetailList
            items={safeReputations}
            renderItem={(item) => (
              <>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "10px" }}>
                  <div>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: palette.ink }}>{item?.name || "이름 없음"}</span>
                    <span style={{ marginLeft: "6px", fontSize: "11px", color: palette.muted }}>{item?.label || ""}</span>
                  </div>
                  <div style={{ flexShrink: 0, fontSize: "11px", fontWeight: 700, color: palette.accent }}>{Math.max(0, Math.min(100, Number(item?.score) || 0))}/100</div>
                </div>
                <ReputationBar score={item?.score} />
                <div style={{ marginTop: "6px", fontSize: "11px", lineHeight: 1.6, color: palette.inkSoft }}>{item?.summary || "평가 없음"}</div>
                <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {normalizeList(item?.tags).map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      style={{
                        padding: "2px 5px",
                        borderTop: `1px solid ${palette.line}`,
                        borderBottom: `1px solid ${palette.line}`,
                        fontSize: "11px",
                        color: palette.inkSoft,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <ReaderComments comments={item?.comments} />
              </>
            )}
          />
        </div>
      );
    }

    if (activeSection === "extras") {
      return (
        <div>
          <BackButton />
          <ArticleTitle title="사교계 잡보란" />

          <div style={{ paddingBottom: "10px" }}>
            <div
              style={{
                marginBottom: "7px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: palette.accent,
              }}
            >
              무도회 뒷이야기
            </div>
            <DetailList
              items={safeBallroomBackstage}
              renderItem={(item) => (
                <>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: palette.ink }}>
                    {item?.title || "제목 없음"}
                  </div>
                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "11px",
                      fontWeight: 600,
                      lineHeight: 1.65,
                      color: palette.inkSoft,
                    }}
                  >
                    {item?.text || "내용 없음"}
                  </div>
                </>
              )}
            />
          </div>

          <Rule margin="4px 0 10px" />

          <div style={{ paddingBottom: "10px" }}>
            <div
              style={{
                marginBottom: "8px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: palette.accent,
              }}
            >
              이번 주 사교계 베팅
            </div>

            {safeWeeklyBets.map((bet, index) => (
              <div
                key={`${bet?.question || "bet"}-${index}`}
                style={{
                  padding: index === 0 ? "0 0 10px" : "10px 0",
                  borderTop: index === 0 ? "none" : `1px solid ${palette.line}`,
                }}
              >
                <div
                  style={{
                    fontSize: "11.5px",
                    fontWeight: 800,
                    lineHeight: 1.5,
                    color: palette.ink,
                  }}
                >
                  {bet?.question || "이번 주의 질문"}
                </div>
                <div style={{ marginTop: "7px", display: "grid", gap: "5px" }}>
                  {normalizeList(bet?.options).map((option, optionIndex) => (
                    <div
                      key={`${option?.label || "option"}-${optionIndex}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                        padding: "4px 0",
                        borderBottom:
                          optionIndex === normalizeList(bet?.options).length - 1
                            ? "none"
                            : `1px dotted ${palette.line}`,
                      }}
                    >
                      <span style={{ fontSize: "11px", fontWeight: 700, color: palette.inkSoft }}>
                        {option?.label || "미상"}
                      </span>
                      <span
                        style={{
                          flexShrink: 0,
                          fontFamily: displayStack,
                          fontSize: "11px",
                          fontWeight: 800,
                          color: palette.accent,
                        }}
                      >
                        {option?.odds || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Rule margin="4px 0 10px" />

          <div>
            <div
              style={{
                marginBottom: "7px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: palette.accent,
              }}
            >
              황도의 유행어
            </div>
            <DetailList
              items={safeCapitalPhrases}
              renderItem={(item) => (
                <>
                  <div
                    style={{
                      fontFamily: displayStack,
                      fontSize: "13px",
                      fontWeight: 800,
                      color: palette.ink,
                    }}
                  >
                    {item?.phrase || "유행어 없음"}
                  </div>
                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "11px",
                      fontWeight: 600,
                      lineHeight: 1.65,
                      color: palette.inkSoft,
                    }}
                  >
                    {item?.meaning || "설명 없음"}
                  </div>
                </>
              )}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "14px 6px",
        boxSizing: "border-box",
        fontFamily: fontStack,
      }}
    >
      <section
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "620px",
          margin: "0 auto",
          overflow: "hidden",
          border: `1px solid ${palette.lineStrong}`,
          backgroundColor: palette.paper,
          boxShadow: "0 7px 20px rgba(37,29,19,0.14)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "14px 18px 15px",
            boxSizing: "border-box",
          }}
        >
          <header style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                fontFamily: displayStack,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: palette.inkSoft,
              }}
            >
              <span>{issueNo}</span>
              <span>{date}</span>
              <span>{price}</span>
            </div>

            <Rule margin="7px 0 6px" />

            <div
              style={{
                fontFamily: displayStack,
                fontSize: "28px",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "0.01em",
                color: palette.ink,
              }}
            >
              {issueTitle}
            </div>
            <div
              style={{
                marginTop: "3px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                color: palette.inkSoft,
              }}
            >
              {issueSubtitle}
            </div>

            <MastRule margin="8px 0" />

            <div
              style={{
                fontSize: "11px",
                fontStyle: "italic",
                lineHeight: 1.45,
                color: palette.muted,
              }}
            >
              {editorNote}
            </div>
          </header>

          {activeSection ? (
            <div style={{ marginTop: "14px" }}>{renderDetail()}</div>
          ) : (
            <div style={{ marginTop: "14px" }}>
              <button
                type="button"
                onClick={(event) => {
                  stopEvent(event);
                  setActiveSection("headline");
                }}
                style={{
                  width: "100%",
                  padding: "0 0 12px",
                  border: "none",
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  color: palette.ink,
                }}
              >
                <div
                  style={{
                    marginBottom: "5px",
                    textAlign: "left",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    color: palette.accent,
                  }}
                >
                  {headline?.kicker || "금주의 대서특필"}
                </div>
                <KaomojiPhoto value={headline?.kaomoji} />
                <div
                  style={{
                    fontFamily: displayStack,
                    fontSize: "24px",
                    fontWeight: 800,
                    lineHeight: 1.25,
                    letterSpacing: "-0.005em",
                    textAlign: "left",
                    color: palette.ink,
                  }}
                >
                  {headline?.title || "제목 없음"}
                </div>
                <div
                  style={{
                    marginTop: "7px",
                    fontSize: "11px",
                    lineHeight: 1.65,
                    color: palette.inkSoft,
                    textAlign: "justify",
                  }}
                >
                  {headline?.summary || "요약 없음"}
                </div>
                <div
                  style={{
                    marginTop: "6px",
                    textAlign: "left",
                    fontSize: "10.5px",
                    fontStyle: "italic",
                    fontWeight: 600,
                    color: palette.muted,
                  }}
                >
                  {headline?.byline || "사교부"} · {date}
                </div>
                <div
                  style={{
                    marginTop: "6px",
                    textAlign: "right",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: palette.muted,
                  }}
                >
                  자세히 읽기 →
                </div>
              </button>

              <Rule thickness={2} margin="2px 0 0" color={palette.ink} />

              <div
                style={{
                  marginTop: "10px",
                  marginBottom: "2px",
                  textAlign: "center",
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  color: palette.muted,
                }}
              >
                이번 호 색인
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  columnGap: "16px",
                }}
              >
                <div>
                  <SectionButton
                    id="sightings"
                    noTopBorder
                    title="목격담"
                    preview={safeSightings[0]?.title || "새로운 목격담이 없습니다."}
                  />
                  <SectionButton
                    id="scandals"
                    title="이번 주 염문"
                    preview={safeScandals[0]?.pair || "이번 주 주요 염문 없음"}
                  />
                  <SectionButton
                    id="reputation"
                    title="사교계 인물 평판"
                    preview={safeReputations[0]?.name || "평판 기록 없음"}
                  />
                </div>

                <div
                  style={{
                    borderLeft: `1px solid ${palette.line}`,
                    paddingLeft: "16px",
                  }}
                >
                  <SectionButton
                    id="tips"
                    noTopBorder
                    title="익명 제보"
                    preview={safeTips[0]?.title || "새로운 제보가 없습니다."}
                  />
                  <SectionButton
                    id="marriage"
                    title="혼담 소문"
                    preview={safeMarriage[0]?.names || "새로운 혼담 소문 없음"}
                  />
                  <SectionButton
                    id="extras"
                    title="사교계 잡보란"
                    preview={
                      safeBallroomBackstage[0]?.title ||
                      safeWeeklyBets[0]?.question ||
                      safeCapitalPhrases[0]?.phrase ||
                      "이번 주의 짧은 소문과 유행"
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <footer
          style={{
            position: "relative",
            zIndex: 1,
            padding: "8px 18px 10px",
            borderTop: `1px solid ${palette.line}`,
            textAlign: "center",
            backgroundColor: "rgba(255,255,255,0.08)",
            color: palette.inkSoft,
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em" }}>
            각 항목을 눌러 지금 바로 최신 기사를 확인하세요 !
          </div>
        </footer>
      </section>
    </div>
  );
}

export default SocietyGazette;
