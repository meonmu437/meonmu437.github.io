import { useState } from 'react';

function RiderClientReviewBoard({
  characterName = "Noé Valenti",
  title = "라이더 익명 리뷰",
  initialPosts = "[]",
}) {
  const [selectedPost, setSelectedPost] = useState(null);

  // 컴포넌트 내부의 클릭이 바깥 웹 UI까지 전달되지 않도록 차단한다.
  const stopInteraction = (event) => {
    if (event && typeof event.stopPropagation === "function") {
      event.stopPropagation();
    }
  };

  const handleSelectPost = (event, post) => {
    stopInteraction(event);
    setSelectedPost(post);
  };

  const handleBackToList = (event) => {
    stopInteraction(event);
    setSelectedPost(null);
  };

  const defaultPosts = [
    {
      id: 1,
      category: "DELIVERY",
      riderName: characterName,
      callSign: "COYOTE",
      title: "시간은 늦었지만 화물은 완벽하게 도착함",
      contract: "북부 정거장 긴급 의약품 운송",
      route: "17번 정거장 → 북부 터널 임시 진료소",
      result: "완료",
      hireAgain: true,
      content:
        "예정 시간보다 40분 늦게 도착했지만, 우회로가 무너진 상황을 감안하면 충분히 이해할 수 있었다.\n\n냉각 상자는 모두 정상 상태였고 봉인도 손상되지 않았다. 설명은 거의 하지 않았지만 필요한 질문에는 정확히 대답했다. 위험한 상황에서 무리하게 속도를 내지 않는 타입으로 보인다.",
      author: "익명 의뢰인 071",
      time: "12분 전",
      score: 5,
      likes: 24,
      views: 183,
      tags: ["화물 보존", "침착함", "말수 적음"],
      clientNote:
        "무뚝뚝하지만 의뢰 조건은 정확하게 지킨다. 재촉하지 않는 편이 좋다.",
      commentList: [
        {
          id: 1,
          author: "익명 의뢰인 104",
          content:
            "나도 같은 라이더에게 맡긴 적 있다. 연락은 짧지만 중간 보고는 빠뜨리지 않았음.",
          time: "10분 전",
        },
        {
          id: 2,
          author: "익명 중개인 009",
          content: "위험 경로라면 추가 연료비를 먼저 제시하는 게 좋다.",
          time: "7분 전",
        },
        {
          id: 3,
          author: "익명 의뢰인 221",
          content: "화물보다 동행인 안전을 먼저 확인하는 타입이었음.",
          time: "방금",
        },
      ],
    },
    {
      id: 2,
      category: "ESCORT",
      riderName: "Mara Voss",
      callSign: "JACKAL",
      title: "호송 실력은 좋지만 계획을 거의 공유하지 않음",
      contract: "서부 지도 제작자 야간 호송",
      route: "폐쇄 대학 기록관 → 12번 정거장",
      result: "완료",
      hireAgain: true,
      content:
        "검문소 두 곳을 문제없이 통과했고 습격도 피했다. 위험을 먼저 알아채는 능력은 확실하다.\n\n다만 경로를 갑자기 바꾸면서 이유를 설명하지 않아 의뢰인 입장에서는 불안했다. 결과적으로 안전하게 도착했지만 이동 중 협의가 필요한 의뢰에는 맞지 않을 수 있다.",
      author: "익명 의뢰인 338",
      time: "25분 전",
      score: 4,
      likes: 37,
      views: 291,
      tags: ["호송 능숙", "설명 부족", "위험 감지"],
      clientNote:
        "운행 방식에 계속 간섭하면 무전을 끄는 경우가 있다. 필요한 말만 하는 편이 좋다.",
      commentList: [
        {
          id: 1,
          author: "익명 의뢰인 052",
          content: "경로를 알려주지는 않아도 도착 시간은 거의 정확했음.",
          time: "20분 전",
        },
        {
          id: 2,
          author: "익명 중개인 180",
          content: "민간인 호송보다 경비 인력이 포함된 의뢰에 더 잘 맞음.",
          time: "18분 전",
        },
        {
          id: 3,
          author: "익명 의뢰인 014",
          content: "위험한 상황에서는 확실히 믿을 만하다.",
          time: "방금",
        },
      ],
    },
    {
      id: 3,
      category: "RECOVERY",
      riderName: "Eli Ward",
      callSign: "MOTH",
      title: "대상은 찾아왔지만 계약에 없던 물건도 가져옴",
      contract: "실종 화물 바이크 회수",
      route: "34번 폐주유소 → 동부 운송 연합",
      result: "조건부 완료",
      hireAgain: false,
      content:
        "분실된 바이크와 화물은 모두 회수했다. 현장에서 적대 세력과 마주쳤다는 보고가 있었지만 눈에 띄는 손상은 없었다.\n\n문제는 의뢰하지 않은 상자 하나를 함께 가져왔다는 점이다. 내용물에 대해서는 설명하지 않았고 인계 직후 바로 떠났다. 실력은 있지만 다시 맡기기는 어렵다.",
      author: "익명 의뢰인 116",
      time: "1시간 전",
      score: 2,
      likes: 18,
      views: 126,
      tags: ["회수 성공", "추가 화물", "설명 거부"],
      clientNote: "화물 목록과 봉인 번호를 출발 전에 반드시 기록해 둘 것.",
      commentList: [
        {
          id: 1,
          author: "익명 의뢰인 090",
          content: "비슷한 경험 있음. 계약에 없는 물건에 관심이 많은 라이더임.",
          time: "48분 전",
        },
        {
          id: 2,
          author: "익명 중개인 201",
          content:
            "회수 능력은 상위권이지만 민감한 화물 의뢰에는 추천하지 않음.",
          time: "31분 전",
        },
      ],
    },
  ];

  const parsePosts = (value) => {
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

  const normalizePost = (post, index) => {
    const item = post && typeof post === "object" ? post : {};
    const score = Number(item.score);
    return {
      id: item.id ?? `review-${index + 1}`,
      category: String(item.category || "OTHER").toUpperCase(),
      riderName: item.riderName || "이름 미상",
      callSign: item.callSign || "UNKNOWN",
      title: item.title || "제목 없는 리뷰",
      contract: item.contract || "계약 정보 없음",
      route: item.route || "경로 정보 없음",
      result: item.result || "결과 미상",
      hireAgain: item.hireAgain === true || item.hireAgain === "true",
      content: item.content || "등록된 리뷰 내용이 없습니다.",
      author: item.author || "익명 의뢰인",
      time: item.time || "시간 정보 없음",
      score: Number.isFinite(score)
        ? Math.max(0, Math.min(5, Math.round(score)))
        : 0,
      likes: Number.isFinite(Number(item.likes)) ? Number(item.likes) : 0,
      views: Number.isFinite(Number(item.views)) ? Number(item.views) : 0,
      tags: Array.isArray(item.tags) ? item.tags : [],
      clientNote: item.clientNote || "",
      commentList: Array.isArray(item.commentList)
        ? item.commentList.map((comment, commentIndex) => ({
            id: comment?.id ?? `${index + 1}-${commentIndex + 1}`,
            author: comment?.author || "익명 사용자",
            content: comment?.content || "내용 없음",
            time: comment?.time || "시간 정보 없음",
          }))
        : [],
    };
  };

  const parsedPosts = parsePosts(initialPosts);
  const posts = (parsedPosts.length ? parsedPosts : defaultPosts).map(
    normalizePost,
  );

  const categories = {
    DELIVERY: {
      label: "운송",
      icon: "▣",
      border: "#747b58",
      bg: "#afb38a",
      color: "#303426",
      line: "#65704f",
    },
    ESCORT: {
      label: "호송",
      icon: "◆",
      border: "#88704d",
      bg: "#c0a878",
      color: "#46361f",
      line: "#92713f",
    },
    RECOVERY: {
      label: "회수",
      icon: "⚒",
      border: "#855847",
      bg: "#b98168",
      color: "#41261e",
      line: "#8b533f",
    },
    OTHER: {
      label: "기타",
      icon: "▤",
      border: "#617075",
      bg: "#8fa1a0",
      color: "#293536",
      line: "#596c70",
    },
  };

  const categoryOf = (post) => categories[post?.category] || categories.OTHER;
  const paperTexture = {
    pointerEvents: "none",
    position: "absolute",
    inset: 0,
    opacity: 0.4,
    backgroundImage:
      "radial-gradient(rgba(62,54,39,0.15) 0.45px, transparent 0.45px), linear-gradient(105deg, transparent 45%, rgba(255,255,255,0.09), transparent 55%)",
    backgroundSize: "7px 7px, 100% 100%",
  };

  const Rating = ({ score = 0, large = false }) => (
    <div
      aria-label={`평점 ${score}점`}
      style={{ display: "flex", gap: "1px", lineHeight: 1 }}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          aria-hidden="true"
          style={{
            fontSize: large ? "17px" : "14px",
            color: index < score ? "#9c6c31" : "#958b71",
          }}
        >
          {index < score ? "★" : "☆"}
        </span>
      ))}
    </div>
  );

  const CategoryBadge = ({ post }) => {
    const category = categoryOf(post);
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          flexShrink: 0,
          border: `1px solid ${category.border}`,
          backgroundColor: category.bg,
          color: category.color,
          padding: "4px 8px",
          fontSize: "10px",
          fontWeight: 900,
        }}
      >
        <span aria-hidden="true">{category.icon}</span>
        {category.label}
      </span>
    );
  };

  const Stat = ({ icon, children, bordered = false }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        borderLeft: bordered ? "1px dashed #91856c" : "none",
        borderRight: bordered ? "1px dashed #91856c" : "none",
        color: "#655d4e",
      }}
    >
      <span aria-hidden="true">{icon}</span>
      <span style={{ fontSize: "10px", fontWeight: 900 }}>{children}</span>
    </div>
  );

  const ReviewCard = ({ post, index }) => {
    const category = categoryOf(post);

    return (
      <button
        type="button"
        onClick={(event) => handleSelectPost(event, post)}
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          border: "1px solid #746c58",
          backgroundColor: "#cfc29f",
          color: "#292a24",
          textAlign: "left",
          cursor: "pointer",
          fontFamily: "inherit",
          padding: 0,
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
          boxShadow: "3px 4px 0 rgba(10,13,11,0.28)",
        }}
      >
        <span aria-hidden="true" style={paperTexture} />
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            top: "6px",
            zIndex: 2,
            width: "10px",
            height: "10px",
            transform: "translateX(-50%)",
            borderRadius: "50%",
            border: "1px solid #3d3227",
            backgroundColor: "#8f6045",
            boxShadow: "1px 2px 2px rgba(0,0,0,0.25)",
          }}
        />
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "0 auto 0 0",
            width: "4px",
            backgroundColor: category.line,
          }}
        />

        <div style={{ position: "relative", padding: "20px 16px 16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                minWidth: 0,
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 900,
                  letterSpacing: "0.12em",
                  color: "#6e6552",
                }}
              >
                REVIEW {String(index + 1).padStart(2, "0")}
              </span>
              <CategoryBadge post={post} />
            </div>
            <span
              style={{
                flexShrink: 0,
                fontSize: "10px",
                fontWeight: 700,
                color: "#756c59",
              }}
            >
              {post.time}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "12px",
              marginTop: "12px",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.11em",
                  color: "#756b57",
                }}
              >
                Reviewed Rider
              </div>
              <h3
                style={{
                  margin: "4px 0 0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: "16px",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  color: "#292a24",
                }}
              >
                {post.riderName}
              </h3>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "11px",
                  fontWeight: 900,
                  color: "#625b4c",
                }}
              >
                CALL SIGN · {post.callSign}
              </p>
            </div>
            <div style={{ flexShrink: 0, textAlign: "right" }}>
              <Rating score={post.score} />
              <span
                style={{
                  display: "inline-block",
                  marginTop: "8px",
                  border: `1px solid ${post.hireAgain ? "#697953" : "#835546"}`,
                  backgroundColor: post.hireAgain ? "#aab487" : "#bc816a",
                  color: post.hireAgain ? "#303a27" : "#43261d",
                  padding: "4px 8px",
                  fontSize: "10px",
                  fontWeight: 900,
                }}
              >
                {post.hireAgain ? "재고용 YES" : "재고용 NO"}
              </span>
            </div>
          </div>

          <h4
            style={{
              margin: "12px 0 0",
              fontSize: "14px",
              fontWeight: 900,
              lineHeight: 1.35,
              color: "#323128",
            }}
          >
            {post.title}
          </h4>
          <p
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              margin: "6px 0 0",
              whiteSpace: "pre-wrap",
              fontSize: "12px",
              fontWeight: 600,
              lineHeight: 1.65,
              color: "#5c5749",
            }}
          >
            {post.content}
          </p>

          <div
            style={{
              display: "flex",
              gap: "7px",
              alignItems: "flex-start",
              marginTop: "12px",
              borderTop: "1px dashed #92866c",
              borderBottom: "1px dashed #92866c",
              padding: "8px 0",
            }}
          >
            <span aria-hidden="true">●</span>
            <p
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                overflow: "hidden",
                margin: 0,
                fontSize: "11px",
                fontWeight: 900,
                color: "#554f43",
              }}
            >
              {post.route}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginTop: "12px",
              color: "#6f6755",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            <span>▲ {post.likes}</span>
            <span>▱ {post.commentList.length}</span>
            <span style={{ marginLeft: "auto" }}>◉ {post.views}</span>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div
      onClick={stopInteraction}
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        borderRadius: "18px",
        border: "2px solid #171b18",
        backgroundColor: "#252b27",
        color: "#d8d3c5",
        fontFamily:
          "Inter, Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        boxShadow: "0 24px 55px rgba(0,0,0,0.42)",
        backgroundImage:
          "linear-gradient(rgba(194,172,120,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(194,172,120,0.025) 1px, transparent 1px), radial-gradient(circle at 80% 0%, rgba(143,92,61,0.13), transparent 33%)",
        backgroundSize: "26px 26px, 26px 26px, 100% 100%",
      }}
    >
      <header
        style={{
          borderBottom: "2px solid #414941",
          backgroundColor: "#2e3530",
          padding: "16px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {selectedPost && (
            <button
              type="button"
              onClick={handleBackToList}
              aria-label="리뷰 목록으로 돌아가기"
              style={{
                display: "flex",
                width: "36px",
                height: "36px",
                flexShrink: 0,
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #59615a",
                backgroundColor: "#3a423c",
                color: "#d3c8ad",
                cursor: "pointer",
                fontSize: "20px",
                fontFamily: "inherit",
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              ‹
            </button>
          )}
          <div
            aria-hidden="true"
            style={{
              display: "flex",
              width: "40px",
              height: "40px",
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #756b53",
              backgroundColor: "#393b32",
              color: "#c6a86d",
              fontSize: "21px",
            }}
          >
            ▤
          </div>
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "17px",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "#e3dccb",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                margin: "2px 0 0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.11em",
                color: "#8e968d",
              }}
            >
              Anonymous Client Board
            </p>
          </div>
        </div>
      </header>

      <main
        style={{
          minHeight: "400px",
          maxHeight: "520px",
          overflowX: "hidden",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
          scrollbarGutter: "stable",
        }}
      >
        {!selectedPost ? (
          <div style={{ padding: "16px 16px 20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "12px",
                marginBottom: "16px",
                borderBottom: "1px solid #4b534c",
                paddingBottom: "12px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "10px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "#b09162",
                  }}
                >
                  Latest Client Reports
                </p>
                <h2
                  style={{
                    margin: "4px 0 0",
                    fontSize: "15px",
                    fontWeight: 900,
                    color: "#d9d4c7",
                  }}
                >
                  최근 등록된 라이더 평가
                </h2>
              </div>
              <span
                style={{
                  border: "1px solid #555e56",
                  backgroundColor: "#313833",
                  padding: "4px 8px",
                  fontSize: "10px",
                  fontWeight: 900,
                  color: "#999f96",
                }}
              >
                {posts.length} REPORTS
              </span>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {posts.map((post, index) => (
                <ReviewCard key={post.id} post={post} index={index} />
              ))}
            </div>

            <div
              style={{
                marginTop: "20px",
                border: "1px dashed #515951",
                backgroundColor: "#2b312d",
                padding: "12px 16px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "10px",
                  fontWeight: 700,
                  lineHeight: 1.7,
                  color: "#8e968d",
                }}
              >
                작성자의 신원은 숨겨지지만 어느 날 주문하지 않은 것이 도착할 수
                있으니 조심하세요.
              </p>
            </div>
          </div>
        ) : (
          <article style={{ padding: "16px 16px 20px" }}>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                border: "1px solid #746c58",
                backgroundColor: "#d0c39f",
                color: "#302f28",
                boxShadow: "4px 6px 0 rgba(8,11,9,0.3)",
              }}
            >
              <div aria-hidden="true" style={paperTexture} />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "8px",
                  zIndex: 2,
                  width: "12px",
                  height: "12px",
                  transform: "translateX(-50%)",
                  borderRadius: "50%",
                  border: "1px solid #453426",
                  backgroundColor: "#925e42",
                  boxShadow: "1px 2px 2px rgba(0,0,0,0.3)",
                }}
              />

              <div
                style={{
                  position: "relative",
                  borderBottom: "2px solid #887d64",
                  padding: "24px 16px 16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      minWidth: 0,
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        display: "flex",
                        width: "36px",
                        height: "36px",
                        flexShrink: 0,
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #877b63",
                        backgroundColor: "#b7aa87",
                        color: "#5c5546",
                        fontSize: "17px",
                      }}
                    >
                      ●
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: "11px",
                          fontWeight: 900,
                          color: "#48453b",
                        }}
                      >
                        {selectedPost.author}
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0",
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#756d5b",
                        }}
                      >
                        {selectedPost.time} · 조회 {selectedPost.views}
                      </p>
                    </div>
                  </div>
                  <CategoryBadge post={selectedPost} />
                </div>
                <h2
                  style={{
                    margin: "20px 0 0",
                    fontSize: "20px",
                    fontWeight: 900,
                    lineHeight: 1.25,
                    letterSpacing: "-0.04em",
                    color: "#282922",
                  }}
                >
                  {selectedPost.title}
                </h2>
              </div>

              <div
                style={{
                  position: "relative",
                  borderBottom: "1px dashed #94886e",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    border: "2px solid #887d64",
                    backgroundColor: "#bdb18e",
                    padding: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "16px",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "10px",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          color: "#6c6453",
                        }}
                      >
                        Reviewed Rider
                      </p>
                      <h3
                        style={{
                          margin: "4px 0 0",
                          fontSize: "18px",
                          fontWeight: 900,
                          color: "#2e2f28",
                        }}
                      >
                        {selectedPost.riderName}
                      </h3>
                      <p
                        style={{
                          margin: "2px 0 0",
                          fontSize: "11px",
                          fontWeight: 900,
                          color: "#5b5548",
                        }}
                      >
                        CALL SIGN · {selectedPost.callSign}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      <Rating score={selectedPost.score} large />
                      <p
                        style={{
                          margin: "6px 0 0",
                          fontSize: "13px",
                          fontWeight: 900,
                          color: "#544d40",
                        }}
                      >
                        {selectedPost.score}.0 / 5
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      marginTop: "16px",
                      borderTop: "1px dashed #8d8269",
                      paddingTop: "12px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "10px",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "#746b58",
                        }}
                      >
                        Contract
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "11px",
                          fontWeight: 900,
                          lineHeight: 1.4,
                          color: "#403e35",
                        }}
                      >
                        {selectedPost.contract}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "10px",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "#746b58",
                        }}
                      >
                        Result
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "11px",
                          fontWeight: 900,
                          color: "#403e35",
                        }}
                      >
                        {selectedPost.result}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      marginTop: "12px",
                      borderTop: "1px dashed #8d8269",
                      paddingTop: "12px",
                    }}
                  >
                    <span aria-hidden="true">●</span>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "11px",
                        fontWeight: 900,
                        lineHeight: 1.6,
                        color: "#474239",
                      }}
                    >
                      {selectedPost.route}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ position: "relative", padding: "20px 16px" }}>
                <p
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    fontSize: "12px",
                    fontWeight: 600,
                    lineHeight: 1.8,
                    color: "#464238",
                  }}
                >
                  {selectedPost.content}
                </p>

                {selectedPost.tags.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginTop: "20px",
                    }}
                  >
                    {selectedPost.tags.map((tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        style={{
                          border: "1px solid #8a7e65",
                          backgroundColor: "#b9ad8b",
                          padding: "4px 8px",
                          fontSize: "10px",
                          fontWeight: 900,
                          color: "#5b5243",
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginTop: "20px",
                    border: `2px solid ${selectedPost.hireAgain ? "#697953" : "#835546"}`,
                    backgroundColor: selectedPost.hireAgain
                      ? "#aab487"
                      : "#bc816a",
                    padding: "12px 16px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "10px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                      }}
                    >
                      Hire Again
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: "11px",
                        fontWeight: 900,
                      }}
                    >
                      이 라이더에게 다시 의뢰하겠습니까?
                    </p>
                  </div>
                  <span style={{ fontSize: "18px", fontWeight: 900 }}>
                    {selectedPost.hireAgain ? "YES" : "NO"}
                  </span>
                </div>

                {selectedPost.clientNote && (
                  <div
                    style={{
                      marginTop: "12px",
                      border: "2px solid #8a6944",
                      backgroundColor: "#c3a574",
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "10px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        color: "#583d22",
                      }}
                    >
                      <span aria-hidden="true">▲</span>Client Note
                    </div>
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: "11px",
                        fontWeight: 900,
                        lineHeight: 1.6,
                        color: "#4b3926",
                      }}
                    >
                      {selectedPost.clientNote}
                    </p>
                  </div>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    marginTop: "20px",
                    borderTop: "1px dashed #91856c",
                    borderBottom: "1px dashed #91856c",
                    padding: "12px 0",
                  }}
                >
                  <Stat icon="▲">신뢰 {selectedPost.likes}</Stat>
                  <Stat icon="▱" bordered>
                    의견 {selectedPost.commentList.length}
                  </Stat>
                  <Stat icon="◉">조회 {selectedPost.views}</Stat>
                </div>
              </div>
            </div>

            <section style={{ marginTop: "20px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {selectedPost.commentList.length > 0 ? (
                  selectedPost.commentList.map((comment, index) => (
                    <div
                      key={comment.id}
                      style={{
                        position: "relative",
                        marginLeft: "12px",
                        border: "1px solid #6d6756",
                        backgroundColor: "#b9ad8d",
                        padding: "12px",
                        color: "#37372f",
                        boxShadow: "2px 3px 0 rgba(8,11,9,0.24)",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: "-12px",
                          top: "16px",
                          display: "flex",
                          width: "24px",
                          height: "24px",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          border: "1px solid #343a35",
                          backgroundColor: "#4b534c",
                          color: "#c9bd9d",
                          fontSize: "9px",
                          fontWeight: 900,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "12px",
                          paddingLeft: "8px",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "10px",
                            fontWeight: 900,
                          }}
                        >
                          {comment.author}
                        </p>
                        <p
                          style={{
                            flexShrink: 0,
                            margin: 0,
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "#716958",
                          }}
                        >
                          {comment.time}
                        </p>
                      </div>
                      <p
                        style={{
                          margin: "6px 0 0",
                          paddingLeft: "8px",
                          fontSize: "11px",
                          fontWeight: 600,
                          lineHeight: 1.65,
                          color: "#4a473d",
                        }}
                      >
                        {comment.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      border: "1px dashed #515951",
                      backgroundColor: "#2b312d",
                      padding: "14px",
                      textAlign: "center",
                      fontSize: "11px",
                      color: "#8e968d",
                    }}
                  >
                    등록된 의견이 없습니다.
                  </div>
                )}
              </div>
            </section>
          </article>
        )}
      </main>

      <footer
        style={{
          borderTop: "2px solid #414941",
          backgroundColor: "#2d342f",
          padding: "12px 20px",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#a88759",
          }}
        >
          Trust Must Be Earned
        </span>
      </footer>
    </div>
  );
}

export default RiderClientReviewBoard;
