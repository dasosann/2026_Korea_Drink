"use client";

import React from "react";
import {
  X,
  Star,
  Heart,
  MapPin,
  Wine,
  AlertTriangle,
  CheckCircle2,
  NotebookPen,
} from "lucide-react";
import { BoothInfo, ZONES } from "@/data/booths";

interface BoothModalProps {
  booth: BoothInfo | null;
  onClose: () => void;
  isBookmarked: boolean;
  isLiked: boolean;
  isVisited: boolean;
  memo: string;
  onToggleBookmark: (id: string) => void;
  onToggleLike: (id: string) => void;
  onToggleVisited: (id: string) => void;
  onChangeMemo: (id: string, text: string) => void;
  onSelectBooth: (id: string) => void;
  nearbyBooths: BoothInfo[];
}

export default function BoothModal({
  booth,
  onClose,
  isBookmarked,
  isLiked,
  isVisited,
  memo,
  onToggleBookmark,
  onToggleLike,
  onToggleVisited,
  onChangeMemo,
  onSelectBooth,
  nearbyBooths,
}: BoothModalProps) {
  if (!booth) return null;

  const zoneMeta = ZONES[booth.zone];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-stone-200 text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Color Accent Bar */}
        <div
          className="h-3 w-full"
          style={{ backgroundColor: zoneMeta.bgHex }}
        />

        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-white/95 backdrop-blur px-6 pt-5 pb-4 border-b border-stone-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-extrabold border shadow-sm"
                style={{
                  backgroundColor: zoneMeta.bgHex,
                  color: zoneMeta.textHex,
                  borderColor: zoneMeta.borderHex,
                }}
              >
                {booth.id} · {zoneMeta.name}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-md">
                <MapPin className="w-3.5 h-3.5 text-stone-600" />
                {booth.region}
              </span>
              {isVisited && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  방문 완료
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black tracking-tight text-stone-900">
              {booth.name}
            </h2>
            <p className="text-sm text-stone-600 mt-0.5 font-medium">
              {booth.tagline}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Buttons Bar: Bookmark (가고싶은 부스) & Visited (방문여부) & Heart (괜찮았던 부스) */}
        <div className="px-6 py-3.5 bg-stone-50 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
            <button
              onClick={() => onToggleBookmark(booth.id)}
              className={`inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm border ${
                isBookmarked
                  ? "bg-amber-400 text-stone-950 border-amber-500 shadow-amber-200/50 scale-[1.01]"
                  : "bg-white text-stone-700 border-stone-300 hover:bg-amber-50 hover:border-amber-300"
              }`}
            >
              <Star
                className={`w-4 h-4 shrink-0 ${
                  isBookmarked ? "fill-stone-950 text-stone-950" : "text-amber-500"
                }`}
              />
              <span>{isBookmarked ? "가고 싶은 부스 저장됨" : "가고 싶은 부스 즐겨찾기"}</span>
            </button>

            <button
              onClick={() => onToggleVisited(booth.id)}
              className={`inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm border ${
                isVisited
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-emerald-200/50 scale-[1.01]"
                  : "bg-white text-stone-700 border-stone-300 hover:bg-emerald-50 hover:border-emerald-300"
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${
                  isVisited ? "text-white" : "text-emerald-600"
                }`}
              />
              <span>{isVisited ? "방문 완료됨 ✓" : "방문 완료 표시"}</span>
            </button>

            <button
              onClick={() => onToggleLike(booth.id)}
              className={`inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm border ${
                isLiked
                  ? "bg-rose-500 text-white border-rose-600 shadow-rose-200/50 scale-[1.01]"
                  : "bg-white text-stone-700 border-stone-300 hover:bg-rose-50 hover:border-rose-300"
              }`}
            >
              <Heart
                className={`w-4 h-4 shrink-0 ${
                  isLiked ? "fill-white text-white" : "text-rose-500"
                }`}
              />
              <span>{isLiked ? "괜찮았던 부스 하트!" : "괜찮았던 부스 하트"}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Special Facility Note from Floorplan if present */}
          {booth.facilityNote && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">배치도 기본부스 특이사항 안내</div>
                <div className="text-xs mt-0.5">{booth.facilityNote}</div>
              </div>
            </div>
          )}

          {/* Booth Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              부스 및 양조장 특징
            </h3>
            <p className="text-sm leading-relaxed text-stone-700 bg-stone-50/80 p-4 rounded-xl border border-stone-200/70">
              {booth.description}
            </p>
          </div>

          {/* Signature Drinks / Products */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Wine className="w-4 h-4 text-amber-700" />
                대표 제품 & 주요 생산 주종
              </h3>
              <span className="text-xs text-stone-500">
                총 {booth.signatureDrinks.length}종
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {booth.signatureDrinks.map((drink, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-stone-50/80 hover:border-amber-400 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-stone-900 text-sm">
                      {drink.name}
                    </span>
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900">
                      {drink.abv}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    주종: {drink.type}
                  </div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {drink.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Tasting Memo */}
          <div>
            <label
              htmlFor="booth-memo"
              className="text-sm font-bold text-stone-900 flex items-center gap-1.5 mb-2"
            >
              <NotebookPen className="w-4 h-4 text-stone-600" />
              나만의 부스 방문 메모
            </label>
            <textarea
              id="booth-memo"
              rows={2}
              value={memo}
              onChange={(e) => onChangeMemo(booth.id, e.target.value)}
              placeholder="인상 깊었던 술, 맛 평가, 구매 기록 등을 자유롭게 메모해보세요 (자동 저장됩니다)"
              className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>

          {/* Tags & Nearby Booths */}
          <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {booth.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {nearbyBooths.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-stone-400 mr-1">같은 존 부스:</span>
                {nearbyBooths.slice(0, 4).map((nb) => (
                  <button
                    key={nb.id}
                    onClick={() => onSelectBooth(nb.id)}
                    className="text-xs px-2 py-1 rounded-md border border-stone-200 bg-white hover:bg-stone-100 font-semibold text-stone-700 transition-colors"
                  >
                    {nb.id} {nb.name.slice(0, 5)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
