"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Star,
  Heart,
  Check,
  CheckCircle2,
  Map,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Wine,
  Trash2,
  X,
  Filter,
  ChevronRight,
  NotebookPen,
  Lightbulb,
  Utensils,
} from "lucide-react";
import {
  BOOTHS,
  BOOTH_MAP,
  BoothInfo,
  ZONES,
  ZoneId,
  VIEWING_TIPS,
} from "@/data/booths";
import ExhibitionFloorplan from "@/components/ExhibitionFloorplan";
import BoothModal from "@/components/BoothModal";

export default function HomePage() {
  // Modal selection state
  const [selectedBoothId, setSelectedBoothId] = useState<string | null>(null);

  // User persistence states: Bookmarks (가고 싶은 부스 ⭐), Likes (괜찮았던 부스 ❤️), Visited (방문 여부 ✓), Memos
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [likes, setLikes] = useState<string[]>([]);
  const [visited, setVisited] = useState<string[]>([]);
  const [memos, setMemos] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Filter & Search states
  const [activeZoneFilter, setActiveZoneFilter] = useState<
    ZoneId | "ALL" | "BOOKMARKED" | "LIKED" | "VISITED"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [zoom, setZoom] = useState(1);

  // Drawer / Original Blueprint modal states
  const [isMyDrawerOpen, setIsMyDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<
    "BOOKMARKED" | "VISITED" | "LIKED"
  >("BOOKMARKED");
  const [showOriginalImage, setShowOriginalImage] = useState(false);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem("urisul_2026_bookmarks");
      const savedLikes = localStorage.getItem("urisul_2026_likes");
      const savedVisited = localStorage.getItem("urisul_2026_visited");
      const savedMemos = localStorage.getItem("urisul_2026_memos");

      if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
      if (savedLikes) setLikes(JSON.parse(savedLikes));
      if (savedVisited) setVisited(JSON.parse(savedVisited));
      if (savedMemos) setMemos(JSON.parse(savedMemos));
    } catch (e) {
      console.error("Failed to load saved booth data", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("urisul_2026_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("urisul_2026_likes", JSON.stringify(likes));
  }, [likes, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("urisul_2026_visited", JSON.stringify(visited));
  }, [visited, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("urisul_2026_memos", JSON.stringify(memos));
  }, [memos, isLoaded]);

  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleVisited = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setVisited((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleChangeMemo = (id: string, text: string) => {
    setMemos((prev) => ({ ...prev, [id]: text }));
  };

  const handleLoadRecommendedCourse = () => {
    const recommendedIds = [
      "K01", // (주)노노스 (체험존/소형부스)
      "A01", // 팔팔양조장 (탁주존)
      "A03", // 같이양조장 (탁주존)
      "C06", // 중원당 청명주 (약·청주존)
      "J07", // (농)(유)화양 풍정사계 (대통령상 수상존)
      "B09", // 고도리와이너리 (과실주존)
      "G01", // 잔치집 모둠전 (먹거리존)
      "E04", // (농)(주)밀과노닐다 진맥소주 (증류주존)
      "F02", // 삼해소주 (증류주존)
      "F06", // (주)부자진 (증류주존)
    ];
    setBookmarks((prev) => Array.from(new Set([...prev, ...recommendedIds])));
  };

  const selectedBooth: BoothInfo | null = selectedBoothId
    ? BOOTH_MAP[selectedBoothId] || null
    : null;

  // Compute nearby booths in the same zone for the modal
  const nearbyBooths = useMemo(() => {
    if (!selectedBooth) return [];
    return BOOTHS.filter(
      (b) => b.zone === selectedBooth.zone && b.id !== selectedBooth.id
    ).slice(0, 5);
  }, [selectedBooth]);

  // Filtered booths for the bottom directory grid
  const filteredBooths = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BOOTHS.filter((booth) => {
      const matchesSearch =
        !q ||
        booth.id.toLowerCase().includes(q) ||
        booth.name.toLowerCase().includes(q) ||
        booth.region.toLowerCase().includes(q) ||
        booth.description.toLowerCase().includes(q) ||
        booth.signatureDrinks.some((d) => d.name.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (activeZoneFilter === "ALL") return true;
      if (activeZoneFilter === "BOOKMARKED") return bookmarks.includes(booth.id);
      if (activeZoneFilter === "LIKED") return likes.includes(booth.id);
      if (activeZoneFilter === "VISITED") return visited.includes(booth.id);
      return booth.zone === activeZoneFilter;
    });
  }, [searchQuery, activeZoneFilter, bookmarks, likes, visited]);

  const activeDrawerList =
    drawerTab === "BOOKMARKED"
      ? bookmarks
      : drawerTab === "VISITED"
      ? visited
      : likes;

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4EC] text-stone-900">
      {/* === STICKY TOP HEADER === */}
      <header className="sticky top-0 z-30 bg-stone-900 text-white shadow-lg border-b border-stone-800">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-stone-950 font-black text-lg shadow">
              술
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight">
                  2026 대한민국 우리술 대축제
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  aT센터 제1전시장
                </span>
              </div>
              <p className="text-xs text-stone-400 flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  2026. 11. 13(금) ~ 11. 15(일)
                </span>
                <span className="hidden sm:inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  주류존 142 + 먹거리존 6 = 148 부스
                </span>
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md min-w-[220px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="부스번호(예: A01, E04), 양조장명(팔팔, 부자진), 주류 검색..."
              className="w-full bg-stone-800/90 text-white placeholder:text-stone-400 text-sm rounded-xl pl-10 pr-8 py-2 border border-stone-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Quick Buttons: My Bookmarks (⭐) & Visited (✓) & My Likes (❤️) & Blueprint View */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setDrawerTab("BOOKMARKED");
                setIsMyDrawerOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 text-stone-950 hover:bg-amber-300 transition shadow-sm"
            >
              <Star className="w-4 h-4 fill-stone-950" />
              <span>가고 싶은 부스</span>
              <span className="px-1.5 py-0.2 rounded-full bg-stone-950 text-amber-300 text-xs font-black">
                {bookmarks.length}
              </span>
            </button>

            <button
              onClick={() => {
                setDrawerTab("VISITED");
                setIsMyDrawerOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>방문 완료</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white text-emerald-700 text-xs font-black">
                {visited.length}
              </span>
            </button>

            <button
              onClick={() => {
                setDrawerTab("LIKED");
                setIsMyDrawerOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-500 text-white hover:bg-rose-400 transition shadow-sm"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>괜찮았던 부스</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white text-rose-600 text-xs font-black">
                {likes.length}
              </span>
            </button>

            <button
              onClick={() => setShowOriginalImage(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition"
              title="원본 부스배치도 이미지 보기"
            >
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>원본 도면 보기</span>
            </button>
          </div>
        </div>
      </header>

      {/* === FILTER & ZOOM CONTROL BAR === */}
      <section className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Zone Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
            <span className="text-xs font-bold text-stone-400 flex items-center gap-1 mr-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />존 필터:
            </span>

            <button
              onClick={() => setActiveZoneFilter("ALL")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 ${
                activeZoneFilter === "ALL"
                  ? "bg-stone-900 text-white shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              전체보기 ({BOOTHS.length})
            </button>

            <button
              onClick={() =>
                setActiveZoneFilter(
                  activeZoneFilter === "BOOKMARKED" ? "ALL" : "BOOKMARKED"
                )
              }
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition shrink-0 border ${
                activeZoneFilter === "BOOKMARKED"
                  ? "bg-amber-400 text-stone-950 border-amber-500 shadow-sm"
                  : "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
              }`}
            >
              <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
              즐겨찾기 ({bookmarks.length})
            </button>

            <button
              onClick={() =>
                setActiveZoneFilter(
                  activeZoneFilter === "VISITED" ? "ALL" : "VISITED"
                )
              }
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition shrink-0 border ${
                activeZoneFilter === "VISITED"
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              <Check className="w-3 h-3 stroke-[3] text-emerald-600" />
              방문완료 ({visited.length})
            </button>

            <button
              onClick={() =>
                setActiveZoneFilter(
                  activeZoneFilter === "LIKED" ? "ALL" : "LIKED"
                )
              }
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition shrink-0 border ${
                activeZoneFilter === "LIKED"
                  ? "bg-rose-500 text-white border-rose-600 shadow-sm"
                  : "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
              }`}
            >
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
              하트 ({likes.length})
            </button>

            <div className="h-4 w-[1px] bg-stone-200 mx-1 shrink-0" />

            {(
              [
                "takju",
                "yakcheongju",
                "gwasilju",
                "jeungryuju",
                "gitajuryu",
                "daetongryeong",
                "meokgeori",
                "sohyeong",
                "jujegwan",
                "cheheom",
                "event",
              ] as ZoneId[]
            ).map((zid) => {
              const zm = ZONES[zid];
              const isActive = activeZoneFilter === zid;
              return (
                <button
                  key={zid}
                  onClick={() =>
                    setActiveZoneFilter(isActive ? "ALL" : zid)
                  }
                  style={
                    isActive
                      ? {
                          backgroundColor: zm.bgHex,
                          color: zm.textHex,
                          borderColor: zm.borderHex,
                        }
                      : undefined
                  }
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition shrink-0 border ${
                    isActive
                      ? "ring-2 ring-stone-900 shadow-sm"
                      : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/20"
                    style={{ backgroundColor: zm.bgHex }}
                  />
                  {zm.name}
                </button>
              );
            })}
          </div>

          {/* Map Zoom Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleLoadRecommendedCourse}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition mr-2"
              title="추천 부스 10곳 즐겨찾기 추가"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              추천 코스 담기
            </button>
            <div className="inline-flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
              <button
                onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.1).toFixed(2)))}
                className="p-1.5 hover:bg-white rounded-md text-stone-700 transition"
                title="축소"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-bold text-stone-700 min-w-[46px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(1.3, +(z + 0.1).toFixed(2)))}
                className="p-1.5 hover:bg-white rounded-md text-stone-700 transition"
                title="확대"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1.5 hover:bg-white rounded-md text-stone-500 hover:text-stone-800 transition"
                title="100% 초기화"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* === MAIN INTERACTIVE FLOORPLAN SECTION === */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto px-4 sm:px-6 py-5 space-y-6">
        {/* Quick Guide Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-50/90 border border-amber-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-amber-950">
          <div className="flex items-center gap-2 font-medium">
            <Map className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>배치도 사용 팁:</strong> 부스를 클릭하면{" "}
              <strong className="underline decoration-amber-500">
                양조장 특징 및 대표 주류 모달
              </strong>
              이 열리며,{" "}
              <strong className="text-amber-700">★즐겨찾기(가고 싶은 부스)</strong>,{" "}
              <strong className="text-emerald-700">✓방문완료</strong>,{" "}
              <strong className="text-rose-600">♥하트(괜찮았던 부스)</strong>를
              체크할 수 있습니다.
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="inline-flex items-center gap-1 text-amber-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-stone-900" />
              가고 싶은 부스: {bookmarks.length}곳
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              방문 완료: {visited.length}곳
            </span>
            <span className="inline-flex items-center gap-1 text-rose-700">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              괜찮았던 부스: {likes.length}곳
            </span>
          </div>
        </div>

        {/* Interactive Floorplan Component */}
        <ExhibitionFloorplan
          selectedBoothId={selectedBoothId}
          onSelectBooth={(id) => setSelectedBoothId(id)}
          bookmarks={bookmarks}
          likes={likes}
          visited={visited}
          onToggleBookmark={handleToggleBookmark}
          onToggleLike={handleToggleLike}
          onToggleVisited={handleToggleVisited}
          activeZoneFilter={activeZoneFilter}
          searchQuery={searchQuery}
          zoom={zoom}
        />

        {/* === 💡 관람 팁 및 페어링 추천 (Tasting Sequence & Pairing Guide) === */}
        <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 pb-3.5">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-400" />
                {VIEWING_TIPS.sequenceTitle}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {VIEWING_TIPS.sequenceDesc}
              </p>
            </div>

            <button
              onClick={handleLoadRecommendedCourse}
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black shadow-sm transition"
            >
              <Star className="w-3.5 h-3.5 fill-stone-950" />
              추천 동선 10개 부스 한번에 즐겨찾기
            </button>
          </div>

          {/* 6-Step Tasting Course Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {VIEWING_TIPS.steps.map((st) => {
              const zm = ZONES[st.targetZone];
              const isZoneSelected = activeZoneFilter === st.targetZone;
              return (
                <div
                  key={st.step}
                  className={`rounded-xl border p-3.5 flex flex-col justify-between transition ${
                    isZoneSelected
                      ? "border-stone-900 ring-2 ring-stone-900 bg-stone-50"
                      : "border-stone-200 bg-stone-50/50 hover:border-amber-400"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[11px] font-black text-stone-400">
                        STEP 0{st.step}
                      </span>
                      <button
                        onClick={() =>
                          setActiveZoneFilter(
                            isZoneSelected ? "ALL" : st.targetZone
                          )
                        }
                        style={{
                          backgroundColor: zm.bgHex,
                          color: zm.textHex,
                          borderColor: zm.borderHex,
                        }}
                        className="px-2 py-0.5 rounded text-[10px] font-black border hover:brightness-95 transition"
                      >
                        {st.zoneLabel} 필터
                      </button>
                    </div>
                    <div className="font-extrabold text-sm text-stone-900">
                      {st.title}
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-200/70 flex flex-wrap gap-1">
                    {st.sampleBoothIds.map((bid) => {
                      const bInfo = BOOTH_MAP[bid];
                      if (!bInfo) return null;
                      return (
                        <button
                          key={bid}
                          onClick={() => setSelectedBoothId(bid)}
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-stone-200 hover:border-amber-500 hover:bg-amber-50 text-stone-700 transition"
                        >
                          {bid} {bInfo.name.slice(0, 5)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pairing Tip Box */}
          <div className="flex items-center gap-3 bg-rose-50/80 border border-rose-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-rose-950">
            <Utensils className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{VIEWING_TIPS.pairingTip}</span>
          </div>
        </section>

        {/* === MY SAVED BOOTHS SUMMARY & SEARCHABLE DIRECTORY GRID === */}
        <section className="space-y-4 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-300 pb-3">
            <div>
              <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <Wine className="w-5 h-5 text-amber-700" />
                전체 부스 리서치 도감 & 빠른 탐색
                <span className="text-sm font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {filteredBooths.length}개 부스
                </span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                각 부스의 양조 특징과 대표 제품 정보를 확인하고 즐겨찾기(★), 방문완료(✓), 하트(♥)로 나만의 리스트를 만들어보세요.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveZoneFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  activeZoneFilter === "ALL"
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-700 border-stone-300"
                }`}
              >
                전체 ({BOOTHS.length})
              </button>
              <button
                onClick={() => setActiveZoneFilter("BOOKMARKED")}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  activeZoneFilter === "BOOKMARKED"
                    ? "bg-amber-400 text-stone-950 border-amber-500"
                    : "bg-white text-stone-700 border-stone-300"
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-600" />
                가고 싶은 부스 ({bookmarks.length})
              </button>
              <button
                onClick={() => setActiveZoneFilter("VISITED")}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  activeZoneFilter === "VISITED"
                    ? "bg-emerald-600 text-white border-emerald-700"
                    : "bg-white text-stone-700 border-stone-300"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                방문 완료 ({visited.length})
              </button>
              <button
                onClick={() => setActiveZoneFilter("LIKED")}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  activeZoneFilter === "LIKED"
                    ? "bg-rose-500 text-white border-rose-600"
                    : "bg-white text-stone-700 border-stone-300"
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                괜찮았던 부스 ({likes.length})
              </button>
            </div>
          </div>

          {filteredBooths.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <p className="text-stone-500 font-semibold">
                조건에 맞는 부스가 없습니다.
              </p>
              <button
                onClick={() => {
                  setActiveZoneFilter("ALL");
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition"
              >
                필터 초기화
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
              {filteredBooths.map((booth) => {
                const zm = ZONES[booth.zone];
                const isBookmarked = bookmarks.includes(booth.id);
                const isLiked = likes.includes(booth.id);
                const isVisited = visited.includes(booth.id);
                const memoText = memos[booth.id];

                return (
                  <div
                    key={booth.id}
                    onClick={() => setSelectedBoothId(booth.id)}
                    className="group bg-white rounded-xl border border-stone-200/90 hover:border-amber-400 shadow-sm hover:shadow-md transition-all p-4 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-black border"
                          style={{
                            backgroundColor: zm.bgHex,
                            color: zm.textHex,
                            borderColor: zm.borderHex,
                          }}
                        >
                          {booth.id} · {zm.name}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleToggleBookmark(booth.id, e)}
                            className={`p-1.5 rounded-lg border transition ${
                              isBookmarked
                                ? "bg-amber-400 border-amber-500 text-stone-950"
                                : "bg-stone-50 border-stone-200 text-stone-400 hover:text-amber-500"
                            }`}
                            title="가고 싶은 부스 즐겨찾기"
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                isBookmarked ? "fill-stone-950" : ""
                              }`}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleToggleVisited(booth.id, e)}
                            className={`p-1.5 rounded-lg border transition ${
                              isVisited
                                ? "bg-emerald-600 border-emerald-700 text-white"
                                : "bg-stone-50 border-stone-200 text-stone-400 hover:text-emerald-600"
                            }`}
                            title="방문 여부 표시"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleToggleLike(booth.id, e)}
                            className={`p-1.5 rounded-lg border transition ${
                              isLiked
                                ? "bg-rose-500 border-rose-600 text-white"
                                : "bg-stone-50 border-stone-200 text-stone-400 hover:text-rose-500"
                            }`}
                            title="괜찮았던 부스 하트"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                isLiked ? "fill-white" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-extrabold text-base text-stone-900 group-hover:text-amber-800 transition-colors">
                        {booth.name}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {booth.region}
                      </p>
                      <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                        {booth.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-700 truncate">
                          🍶 {booth.signatureDrinks[0]?.name}
                        </span>
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
                          {booth.signatureDrinks[0]?.abv}
                        </span>
                      </div>

                      {memoText && (
                        <div className="text-[11px] bg-amber-50/80 text-amber-900 px-2 py-1 rounded flex items-center gap-1 truncate">
                          <NotebookPen className="w-3 h-3 shrink-0" />
                          <span className="truncate">{memoText}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* === BOOTH DETAIL MODAL === */}
      <BoothModal
        booth={selectedBooth}
        onClose={() => setSelectedBoothId(null)}
        isBookmarked={
          selectedBooth ? bookmarks.includes(selectedBooth.id) : false
        }
        isLiked={selectedBooth ? likes.includes(selectedBooth.id) : false}
        isVisited={selectedBooth ? visited.includes(selectedBooth.id) : false}
        memo={selectedBooth ? memos[selectedBooth.id] || "" : ""}
        onToggleBookmark={handleToggleBookmark}
        onToggleLike={handleToggleLike}
        onToggleVisited={handleToggleVisited}
        onChangeMemo={handleChangeMemo}
        onSelectBooth={(id) => setSelectedBoothId(id)}
        nearbyBooths={nearbyBooths}
      />

      {/* === SLIDE-OVER DRAWER FOR SAVED BOOTHS (가고 싶은 부스 ⭐ / 방문 완료 ✓ / 괜찮았던 부스 ❤️) === */}
      {isMyDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsMyDrawerOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 bg-stone-900 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black">내 우리술 투어 보관함</h2>
                <button
                  onClick={() => setIsMyDrawerOpen(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 3 Tabs: Bookmarked / Visited / Liked */}
              <div className="grid grid-cols-3 gap-1.5 bg-stone-800 p-1 rounded-xl">
                <button
                  onClick={() => setDrawerTab("BOOKMARKED")}
                  className={`flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-bold transition ${
                    drawerTab === "BOOKMARKED"
                      ? "bg-amber-400 text-stone-950 shadow"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      drawerTab === "BOOKMARKED" ? "fill-stone-950" : ""
                    }`}
                  />
                  가고싶은 ({bookmarks.length})
                </button>
                <button
                  onClick={() => setDrawerTab("VISITED")}
                  className={`flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-bold transition ${
                    drawerTab === "VISITED"
                      ? "bg-emerald-600 text-white shadow"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  방문완료 ({visited.length})
                </button>
                <button
                  onClick={() => setDrawerTab("LIKED")}
                  className={`flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-bold transition ${
                    drawerTab === "LIKED"
                      ? "bg-rose-500 text-white shadow"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      drawerTab === "LIKED" ? "fill-white" : ""
                    }`}
                  />
                  괜찮았던 ({likes.length})
                </button>
              </div>
            </div>

            {/* Drawer Content List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeDrawerList.length === 0 ? (
                <div className="text-center py-16 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                    {drawerTab === "BOOKMARKED" ? (
                      <Star className="w-6 h-6" />
                    ) : drawerTab === "VISITED" ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Heart className="w-6 h-6" />
                    )}
                  </div>
                  <p className="text-sm font-bold text-stone-700">
                    {drawerTab === "BOOKMARKED"
                      ? "아직 즐겨찾기한 '가고 싶은 부스'가 없습니다."
                      : drawerTab === "VISITED"
                      ? "아직 체크한 '방문 완료 부스'가 없습니다."
                      : "아직 하트를 누른 '괜찮았던 부스'가 없습니다."}
                  </p>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    배치도에서 부스를 클릭하거나 마우스를 올려{" "}
                    {drawerTab === "BOOKMARKED"
                      ? "별표(★) 아이콘"
                      : drawerTab === "VISITED"
                      ? "체크(✓) 아이콘"
                      : "하트(♥) 아이콘"}
                    을 눌러보세요!
                  </p>
                </div>
              ) : (
                activeDrawerList.map((id) => {
                  const booth = BOOTH_MAP[id];
                  if (!booth) return null;
                  const zm = ZONES[booth.zone];
                  return (
                    <div
                      key={id}
                      onClick={() => {
                        setSelectedBoothId(id);
                        setIsMyDrawerOpen(false);
                      }}
                      className="p-3.5 rounded-xl border border-stone-200 hover:border-amber-400 bg-stone-50/60 hover:bg-white transition cursor-pointer flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-black border"
                            style={{
                              backgroundColor: zm.bgHex,
                              color: zm.textHex,
                              borderColor: zm.borderHex,
                            }}
                          >
                            {booth.id} · {zm.name}
                          </span>
                          <span className="text-xs text-stone-500">
                            {booth.region}
                          </span>
                        </div>
                        <div className="font-bold text-sm text-stone-900">
                          {booth.name}
                        </div>
                        <div className="text-xs text-stone-600">
                          대표제품: {booth.signatureDrinks[0]?.name} (
                          {booth.signatureDrinks[0]?.abv})
                        </div>
                        {memos[id] && (
                          <div className="text-xs text-amber-900 bg-amber-50 px-2 py-1 rounded border border-amber-200 mt-1">
                            📝 {memos[id]}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (drawerTab === "BOOKMARKED") {
                              handleToggleBookmark(id);
                            } else if (drawerTab === "VISITED") {
                              handleToggleVisited(id);
                            } else {
                              handleToggleLike(id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100"
                          title="목록에서 제거"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-stone-400" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setActiveZoneFilter(drawerTab);
                  setIsMyDrawerOpen(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition"
              >
                배치도에서 이 부스들만 하이라이트 보기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === ORIGINAL FLOORPLAN IMAGE MODAL === */}
      {showOriginalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setShowOriginalImage(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-black text-base text-stone-900">
                  2026 대한민국 우리술 대축제 원본 부스배치도 (aT센터 제1전시장)
                </h3>
                <p className="text-xs text-stone-500">
                  주류존 142 + 먹거리존 6 = 148 부스 공식 도면
                </p>
              </div>
              <button
                onClick={() => setShowOriginalImage(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src="/booth-map-original.jpg"
              alt="2026 대한민국 우리술 대축제 부스배치도 원본"
              className="w-full h-auto rounded-lg border border-stone-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}
