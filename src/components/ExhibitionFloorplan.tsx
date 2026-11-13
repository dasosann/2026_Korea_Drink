"use client";

import React from "react";
import {
  Star,
  Heart,
  Check,
  Volume2,
  Droplets,
  DoorOpen,
} from "lucide-react";
import { BOOTH_MAP, BoothInfo, ZONES, ZoneId } from "@/data/booths";

interface ExhibitionFloorplanProps {
  selectedBoothId: string | null;
  onSelectBooth: (id: string) => void;
  bookmarks: string[];
  likes: string[];
  visited: string[];
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
  onToggleLike: (id: string, e?: React.MouseEvent) => void;
  onToggleVisited: (id: string, e?: React.MouseEvent) => void;
  activeZoneFilter: ZoneId | "ALL" | "BOOKMARKED" | "LIKED" | "VISITED";
  searchQuery: string;
  zoom: number;
}

// Top Row Islands (10 islands, left to right)
const TOP_ISLANDS: Array<{
  id: string;
  rows: Array<[string, string]>;
}> = [
  {
    id: "T1",
    rows: [
      ["K04", "B09"],
      ["K03", "B08"],
      ["K02", "B07"],
      ["K01", "B06"],
    ],
  },
  {
    id: "T2",
    rows: [
      ["B10", "B17"],
      ["B11", "B16"],
      ["B12", "B15"],
      ["B13", "B14"],
    ],
  },
  {
    id: "T3",
    rows: [
      ["B18", "B23"],
      ["B19", "B22"],
      ["B20", "B21"],
    ],
  },
  {
    id: "T4",
    rows: [
      ["B24", "B29"],
      ["B25", "B28"],
      ["B26", "B27"],
    ],
  },
  {
    id: "T5",
    rows: [
      ["C03", "C04"],
      ["C02", "C05"],
      ["C01", "C06"],
    ],
  },
  {
    id: "T6",
    rows: [
      ["C09", "C10"],
      ["C08", "C11"],
      ["C07", "C12"],
    ],
  },
  {
    id: "T7",
    rows: [
      ["C15", "C16"],
      ["C14", "C17"],
      ["C13", "C18"],
    ],
  },
  {
    id: "T8",
    rows: [
      ["C21", "C22"],
      ["C20", "C23"],
      ["C19", "C24"],
    ],
  },
  {
    id: "T9",
    rows: [
      ["D03", "D04"],
      ["D02", "D05"],
      ["D01", "D06"],
    ],
  },
  {
    id: "T10",
    rows: [
      ["D09", "D10"],
      ["D08", "D11"],
      ["D07", "D12"],
    ],
  },
];

// Middle Horizontal Pairs (East-West Bridge between carpets)
const MIDDLE_PAIRS: Array<{
  pair: [string, string];
  washAfter?: boolean;
}> = [
  { pair: ["E01", "E02"] },
  { pair: ["E03", "E04"] },
  { pair: ["F01", "F02"], washAfter: true },
  { pair: ["F03", "F04"] },
  { pair: ["F05", "F06"] },
  { pair: ["F07", "F08"] },
  { pair: ["D13", "D14"], washAfter: true },
];

// Bottom Standard 3x2 Islands (from A10..A52 & G01..G03)
const BOTTOM_STANDARD_ISLANDS: Array<{
  id: string;
  rows: Array<[string, string]>;
}> = [
  {
    id: "B4",
    rows: [
      ["A10", "A11"],
      ["A09", "A12"],
      ["A08", "A13"],
    ],
  },
  {
    id: "B5",
    rows: [
      ["A16", "A17"],
      ["A15", "A18"],
      ["A14", "A19"],
    ],
  },
  {
    id: "B6",
    rows: [
      ["A22", "A23"],
      ["A21", "A24"],
      ["A20", "A25"],
    ],
  },
  {
    id: "B7",
    rows: [
      ["A28", "A29"],
      ["A27", "A30"],
      ["A26", "A31"],
    ],
  },
  {
    id: "B8",
    rows: [
      ["A34", "A35"],
      ["A33", "A36"],
      ["A32", "A37"],
    ],
  },
  {
    id: "B9",
    rows: [
      ["A40", "A41"],
      ["A39", "A42"],
      ["A38", "A43"],
    ],
  },
  {
    id: "B10",
    rows: [
      ["A46", "A47"],
      ["A45", "A48"],
      ["A44", "A49"],
    ],
  },
  {
    id: "B11",
    rows: [
      ["A52", "G03"],
      ["A51", "G02"],
      ["A50", "G01"],
    ],
  },
];

export default function ExhibitionFloorplan({
  selectedBoothId,
  onSelectBooth,
  bookmarks,
  likes,
  visited,
  onToggleBookmark,
  onToggleLike,
  onToggleVisited,
  activeZoneFilter,
  searchQuery,
  zoom,
}: ExhibitionFloorplanProps) {
  const isBoothMatched = (booth: BoothInfo): boolean => {
    const q = searchQuery.trim().toLowerCase();
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
  };

  const renderBoothCell = (
    boothId: string,
    customClass = "w-[68px] h-[54px]"
  ) => {
    const booth = BOOTH_MAP[boothId];
    if (!booth) return null;

    const zoneMeta = ZONES[booth.zone];
    const isBookmarked = bookmarks.includes(boothId);
    const isLiked = likes.includes(boothId);
    const isVisited = visited.includes(boothId);
    const isSelected = selectedBoothId === boothId;
    const matched = isBoothMatched(booth);
    const isFiltering =
      activeZoneFilter !== "ALL" || searchQuery.trim().length > 0;

    return (
      <div
        key={boothId}
        onClick={() => onSelectBooth(boothId)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectBooth(boothId);
          }
        }}
        style={{
          backgroundColor: zoneMeta.bgHex,
          color: zoneMeta.textHex,
          borderColor: isSelected ? "#111827" : zoneMeta.borderHex,
        }}
        className={`group relative select-none border transition-all duration-150 flex flex-col justify-between p-1 cursor-pointer ${customClass} ${
          isSelected
            ? "ring-2 ring-stone-950 z-20 scale-105 shadow-lg"
            : "hover:z-20 hover:scale-[1.06] hover:shadow-md"
        } ${
          isFiltering && !matched
            ? "opacity-25 saturate-50"
            : isFiltering && matched
            ? "ring-2 ring-amber-500 z-10 shadow-md"
            : ""
        }`}
        title={`${booth.id} ${booth.name} (${zoneMeta.name})`}
      >
        {/* Top Row: Booth ID + Active Badges */}
        <div className="flex items-center justify-between gap-0.5 leading-none">
          <span className="text-[10px] font-black tracking-tighter opacity-90">
            {booth.id}
          </span>
          <div className="flex items-center gap-0.5">
            {booth.facilityNote && (
              <span
                className="w-2 h-2 rounded-full bg-amber-600 inline-block"
                title={booth.facilityNote}
              />
            )}
            {isVisited && (
              <span
                className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-600 text-white shadow-sm"
                title="방문 완료"
              >
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
            {isBookmarked && (
              <span
                className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-amber-400 text-stone-950 shadow-sm"
                title="가고 싶은 부스"
              >
                <Star className="w-2.5 h-2.5 fill-stone-950" />
              </span>
            )}
            {isLiked && (
              <span
                className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-rose-500 text-white shadow-sm"
                title="괜찮았던 부스"
              >
                <Heart className="w-2.5 h-2.5 fill-white" />
              </span>
            )}
          </div>
        </div>

        {/* Booth Name */}
        <div className="text-[9.5px] font-bold leading-[1.15] break-keep line-clamp-2 tracking-tight">
          {booth.name}
        </div>

        {/* Hover Quick Action Overlay (Star / Visited / Heart toggle directly on map) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-0.5 bg-stone-900/95 text-white px-1.5 py-0.5 rounded-full shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(booth.id, e);
            }}
            className={`p-0.5 rounded-full hover:bg-stone-700 ${
              isBookmarked ? "text-amber-400" : "text-stone-300"
            }`}
            title="가고 싶은 부스 즐겨찾기"
          >
            <Star
              className={`w-3 h-3 ${isBookmarked ? "fill-amber-400" : ""}`}
            />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisited(booth.id, e);
            }}
            className={`p-0.5 rounded-full hover:bg-stone-700 ${
              isVisited ? "text-emerald-400" : "text-stone-300"
            }`}
            title="방문 여부 표시"
          >
            <Check className="w-3 h-3 stroke-[3]" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(booth.id, e);
            }}
            className={`p-0.5 rounded-full hover:bg-stone-700 ${
              isLiked ? "text-rose-400" : "text-stone-300"
            }`}
            title="괜찮았던 부스 하트"
          >
            <Heart className={`w-3 h-3 ${isLiked ? "fill-rose-400" : ""}`} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
        }}
        className="min-w-[1620px] bg-white rounded-2xl border-2 border-stone-300 shadow-xl p-6 transition-transform duration-150"
      >
        {/* === BLUEPRINT TOP HEADER & LEGEND (Matches Image Top Area) === */}
        <div className="grid grid-cols-12 gap-4 items-start mb-5 pb-4 border-b border-stone-200">
          {/* Left: Special Booth Notes (★기본부스 특이사항) */}
          <div className="col-span-3 bg-stone-50 rounded-xl p-3.5 border border-stone-200 text-xs text-stone-700 space-y-1">
            <div className="font-black text-stone-900 flex items-center gap-1">
              <span>★ 기본부스 특이사항</span>
            </div>
            <p className="text-[11px] text-stone-600">
              <strong className="text-stone-900">A11</strong> (인천탁주 제조제1공장) - 선반, 전시 테이블 제거
            </p>
            <p className="text-[11px] text-stone-600">
              <strong className="text-stone-900">D02</strong> ((농)시트러스(주)) - 선반 제거
            </p>
            <p className="text-[11px] text-stone-600">
              <strong className="text-stone-900">D11</strong> (브리즈앤스트림) - 선반 제거
            </p>
            <p className="text-[10px] text-amber-700 pt-1 font-medium">
              💡 각 부스를 클릭하면 상세 정보 모달이 열립니다.
            </p>
          </div>

          {/* Center: Color Legend Box (Matches Blueprint Legend) */}
          <div className="col-span-6 bg-white rounded-xl p-3.5 border-2 border-stone-400 shadow-sm">
            <div className="grid grid-cols-5 gap-x-3 gap-y-2 text-xs">
              {(
                [
                  "takju",
                  "jeungryuju",
                  "yangjojang",
                  "event",
                ] as ZoneId[]
              ).map((zid) => (
                <div key={zid} className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-sm border shrink-0"
                    style={{
                      backgroundColor: ZONES[zid].bgHex,
                      borderColor: ZONES[zid].borderHex,
                    }}
                  />
                  <span className="font-bold text-stone-800">
                    {ZONES[zid].name}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#1D50A2] inline-block shrink-0" />
                <span className="font-bold text-stone-800">세척존</span>
              </div>

              {(
                [
                  "yakcheongju",
                  "gitajuryu",
                  "cheheom",
                  "sohyeong",
                ] as ZoneId[]
              ).map((zid) => (
                <div key={zid} className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-sm border shrink-0"
                    style={{
                      backgroundColor: ZONES[zid].bgHex,
                      borderColor: ZONES[zid].borderHex,
                    }}
                  />
                  <span className="font-bold text-stone-800">
                    {ZONES[zid].name}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-sm bg-[#D1D3D4] border border-stone-400 inline-block shrink-0" />
                <span className="font-bold text-stone-800">부대시설물</span>
              </div>

              {(
                [
                  "gwasilju",
                  "meokgeori",
                  "jujegwan",
                  "daetongryeong",
                ] as ZoneId[]
              ).map((zid) => (
                <div
                  key={zid}
                  className={`flex items-center gap-2 ${
                    zid === "daetongryeong" ? "col-span-2" : ""
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-sm border shrink-0"
                    style={{
                      backgroundColor: ZONES[zid].bgHex,
                      borderColor: ZONES[zid].borderHex,
                    }}
                  />
                  <span className="font-bold text-stone-800">
                    {ZONES[zid].name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Event Schedule & Venue Summary */}
          <div className="col-span-3 bg-stone-50 rounded-xl p-3.5 border border-stone-200 text-xs space-y-1">
            <div className="font-black text-sm text-stone-900">
              2026 대한민국 우리술 대축제
            </div>
            <div className="text-stone-600">
              <strong>행사:</strong> 11월 13일~15일 (3일간)
            </div>
            <div className="text-stone-600">
              <strong>시공:</strong> 11월 11일~12일 / <strong>철거:</strong> 11월 15일 19:00~24:00
            </div>
            <div className="text-stone-600">
              <strong>장소:</strong> aT센터 제1전시장
            </div>
            <div className="pt-1 font-extrabold text-amber-900">
              주류존 142 + 먹거리존 6 = 148B
            </div>
          </div>
        </div>

        {/* === MAIN EXHIBITION HALL ARCHITECTURAL FLOORPLAN === */}
        <div className="relative bg-[#F9FBFD] border-2 border-stone-400 rounded-xl p-4">
          {/* Top Wall Emergency Exit Markers & 냉장 컨테이너 */}
          <div className="flex items-center justify-between mb-3 px-2 text-[11px] font-bold text-stone-500">
            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 bg-stone-200 border border-stone-400 rounded text-stone-700 font-bold">
                냉장 컨테이너
              </div>
              <span className="inline-flex items-center gap-1 text-red-600">
                ▲ 비상출입구
              </span>
            </div>
            <div className="flex items-center gap-16">
              <span className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[10px]">
                비상구
              </span>
              <span className="text-stone-700 font-extrabold">34 &nbsp;&nbsp;&nbsp; 34</span>
              <span className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[10px]">
                비상구
              </span>
              <span className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[10px]">
                비상구
              </span>
            </div>
            <div className="px-4 py-1 bg-stone-200 border border-stone-400 rounded text-stone-700 font-bold mr-20">
              콘솔 (Console)
            </div>
          </div>

          <div className="flex items-stretch gap-3">
            {/* LEFT LOADING DOCK (하역장) & LEFTMOST B05~B02 COLUMN */}
            <div className="flex flex-col justify-between w-[110px] shrink-0">
              {/* 하역장 Box */}
              <div className="h-[220px] border-2 border-dashed border-stone-300 bg-stone-100/70 rounded-lg flex flex-col items-center justify-center text-stone-500 font-bold text-xs p-2 text-center">
                <span>하역장</span>
                <span className="text-[10px] font-normal text-stone-400 mt-1">
                  Loading Dock
                </span>
              </div>

              {/* Leftmost Vertical Booth Column: B05, B04, B03, B02 */}
              <div className="flex flex-col items-end pr-1 pt-6">
                <div className="text-[9px] font-bold text-stone-400 mb-1">
                  증류주존 (좌측열)
                </div>
                <div className="flex flex-col shadow-sm">
                  {["B05", "B04", "B03", "B02"].map((id) =>
                    renderBoothCell(id, "w-[74px] h-[52px]")
                  )}
                </div>
              </div>
            </div>

            {/* CENTER MAIN BOOTH AREA (Top Islands + Middle Bridge + Bottom Islands) */}
            <div className="flex-1 flex flex-col justify-between space-y-3">
              {/* 1) TOP ROW OF 10 BOOTH ISLANDS */}
              <div className="flex items-start justify-between gap-2">
                {TOP_ISLANDS.map((island) => (
                  <div
                    key={island.id}
                    className="flex flex-col shadow-sm rounded-sm overflow-visible"
                  >
                    {island.rows.map(([leftId, rightId], rIdx) => (
                      <div key={rIdx} className="flex">
                        {renderBoothCell(leftId, "w-[62px] h-[52px]")}
                        {renderBoothCell(rightId, "w-[62px] h-[52px]")}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* 2) CENTRAL AISLE: CARPET + EXPERIENCE ZONE + 7 BRIDGE PAIRS + CARPET */}
              <div className="space-y-2 py-1">
                {/* Upper Carpet Strip (바닥재 70×2m) */}
                <div className="ml-[260px] mr-[90px] h-5 bg-[#DCE7D6] border border-[#B8CCA9] rounded flex items-center justify-center text-[10px] font-bold text-stone-700 tracking-wider">
                  바닥재 70×2m (메인 동선)
                </div>

                {/* Middle Row: 세척존 + 체험존 (9×6) + E01~D14 Horizontal Pairs */}
                <div className="flex items-center gap-3 pl-[215px]">
                  {/* Wash zone circle left of Experience Zone */}
                  <div
                    className="w-5 h-5 rounded-full bg-[#1D50A2] text-white flex items-center justify-center shadow"
                    title="세척존 (음수 및 잔 세척)"
                  >
                    <Droplets className="w-3 h-3" />
                  </div>

                  {/* 체험존 (9×6) */}
                  {renderBoothCell("EXP01", "w-[135px] h-[68px] text-center")}

                  {/* 7 Horizontal Booth Pairs: E01|E02 .. D13|D14 */}
                  <div className="flex items-center gap-3">
                    {MIDDLE_PAIRS.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <div className="flex shadow-sm">
                          {renderBoothCell(item.pair[0], "w-[62px] h-[52px]")}
                          {renderBoothCell(item.pair[1], "w-[62px] h-[52px]")}
                        </div>
                        {item.washAfter && (
                          <div
                            className="w-5 h-5 rounded-full bg-[#1D50A2] text-white flex items-center justify-center shadow shrink-0"
                            title="세척존 (음수 및 잔 세척)"
                          >
                            <Droplets className="w-3 h-3" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Lower Carpet Strip (바닥재 70×2m) */}
                <div className="ml-[260px] mr-[90px] h-5 bg-[#DCE7D6] border border-[#B8CCA9] rounded flex items-center justify-center text-[10px] font-bold text-stone-700 tracking-wider">
                  바닥재 70×2m (메인 동선)
                </div>
              </div>

              {/* 3) BOTTOM ROW OF BOOTH ISLANDS */}
              <div className="flex items-end justify-between gap-2">
                {/* Island B2: Presidential Award Zone (J03~J01+B01 / J04~J07, 4 rows x 2 cols) */}
                <div className="flex flex-col shadow-sm">
                  {[
                    ["J03", "J04"],
                    ["J02", "J05"],
                    ["J01", "J06"],
                    ["B01", "J07"],
                  ].map(([lId, rId], idx) => (
                    <div key={idx} className="flex">
                      {renderBoothCell(lId, "w-[62px] h-[52px]")}
                      {renderBoothCell(rId, "w-[62px] h-[52px]")}
                    </div>
                  ))}
                </div>

                {/* Island B3: A01~A04 + H01 주제관 + A07 + A05~A06 (3 rows x 4 cols composite) */}
                <div className="flex flex-col shadow-sm">
                  {/* Row 1: A01, A02, A03, A04 */}
                  <div className="flex">
                    {["A01", "A02", "A03", "A04"].map((id) =>
                      renderBoothCell(id, "w-[58px] h-[52px]")
                    )}
                  </div>
                  {/* Rows 2 & 3 composite */}
                  <div className="flex">
                    {/* Left 3 cols x 2 rows: H01 주제관 with A07 at bottom-right */}
                    <div className="flex flex-col">
                      <div className="flex">
                        {renderBoothCell(
                          "H01",
                          "w-[174px] h-[52px] flex-row items-center justify-between px-3"
                        )}
                      </div>
                      <div className="flex">
                        <div
                          onClick={() => onSelectBooth("H01")}
                          className="w-[116px] h-[52px] bg-[#874C9E] border border-[#69367D] text-white p-1.5 flex items-center justify-center text-xs font-black cursor-pointer hover:brightness-110 transition"
                        >
                          주제관 전시홀
                        </div>
                        {renderBoothCell("A07", "w-[58px] h-[52px]")}
                      </div>
                    </div>
                    {/* Col 4 (Rightmost of Island B3): A05, A06 */}
                    <div className="flex flex-col">
                      {renderBoothCell("A05", "w-[58px] h-[52px]")}
                      {renderBoothCell("A06", "w-[58px] h-[52px]")}
                    </div>
                  </div>
                </div>

                {/* Islands B4 ~ B11 (8 Islands of 3 rows x 2 cols: A10..A52 & G03..G01) */}
                {BOTTOM_STANDARD_ISLANDS.map((island) => (
                  <div key={island.id} className="flex flex-col shadow-sm">
                    {island.rows.map(([lId, rId], rIdx) => (
                      <div key={rIdx} className="flex">
                        {renderBoothCell(lId, "w-[58px] h-[52px]")}
                        {renderBoothCell(rId, "w-[58px] h-[52px]")}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE: STAGE (무대) & RIGHTMOST EVENT/FOOD COLUMN (I01 + G04~G06) */}
            <div className="w-[140px] shrink-0 flex flex-col justify-between items-center pl-2">
              {/* Stage & Audience Seating (Top-Right of Hall) */}
              <div className="w-full flex flex-col items-center space-y-2">
                {/* Seating grid dots */}
                <div className="grid grid-cols-5 gap-1 p-1.5 bg-stone-100 rounded border border-stone-200">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-sm bg-stone-400 inline-block"
                    />
                  ))}
                </div>

                {/* Stage Box (무대 7.2×4.8) */}
                <div className="w-full h-[120px] bg-[#D1D3D4] border-2 border-stone-400 rounded-lg flex flex-col items-center justify-center text-stone-800 shadow-inner p-2 text-center">
                  <Volume2 className="w-5 h-5 text-stone-600 mb-1" />
                  <span className="font-black text-xs">무대</span>
                  <span className="text-[10px] font-semibold text-stone-600">
                    (7.2×4.8m)
                  </span>
                  <span className="text-[9px] text-stone-500 mt-1">
                    경매쇼 · 토크콘서트
                  </span>
                </div>

                {/* Lower Seating grid dots */}
                <div className="grid grid-cols-5 gap-1 p-1.5 bg-stone-100 rounded border border-stone-200">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-sm bg-stone-400 inline-block"
                    />
                  ))}
                </div>
              </div>

              {/* Rightmost Vertical Column: I01 이벤트존 + G04, G05, G06 먹거리존 */}
              <div className="flex flex-col items-center mt-2 shadow-sm">
                {renderBoothCell("I01", "w-[72px] h-[110px]")}
                {renderBoothCell("G04", "w-[72px] h-[52px]")}
                {renderBoothCell("G05", "w-[72px] h-[52px]")}
                {renderBoothCell("G06", "w-[72px] h-[52px]")}
              </div>
            </div>
          </div>

          {/* === BOTTOM ENTRANCE / EXIT / VIP ROOM / ORGANIZER OFFICE BAR === */}
          <div className="mt-5 pt-3 border-t-2 border-stone-300 flex items-center justify-between px-10 text-xs font-bold text-stone-700">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-emerald-800 text-white rounded text-[11px]">
                화장실 🚻
              </span>
              <span className="px-3 py-1 bg-stone-200 border border-stone-400 rounded text-[11px]">
                등록데스크 / 현장판매처 캐비닛
              </span>
            </div>

            {/* Entrance (입구 ▲) */}
            <div className="flex items-center gap-2 px-4 py-1.5 bg-red-50 border-2 border-red-500 text-red-700 rounded-full shadow-sm">
              <DoorOpen className="w-4 h-4" />
              <span className="font-black">입구 ▲ (Entrance)</span>
            </div>

            {/* Organizer Office & VIP Room */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-emerald-800 text-white rounded text-[11px]">
                화장실 🚻
              </span>
              <div className="px-3 py-1.5 bg-stone-100 border border-stone-300 rounded text-stone-700">
                주최자사무실 / 수유실
              </div>
              <div className="px-4 py-1.5 bg-stone-100 border border-stone-300 rounded text-stone-500">
                VIP ROOM
              </div>
            </div>

            {/* Exit (출구 ▼) */}
            <div className="flex items-center gap-2 px-4 py-1.5 bg-red-50 border-2 border-red-500 text-red-700 rounded-full shadow-sm">
              <span className="font-black">출구 ▼ (Exit)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-emerald-800 text-white rounded text-[11px]">
                화장실 🚻
              </span>
            </div>
          </div>

          {/* Bottom-most Lobby Label (주출입구) */}
          <div className="mt-2 flex justify-center">
            <div className="px-8 py-1 bg-stone-800 text-white text-xs font-extrabold rounded-full tracking-widest uppercase shadow">
              ▲ aT센터 제1전시장 주출입구 (Main Lobby) ▲
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
