import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2026 대한민국 우리술 대축제 | 인터랙티브 부스 배치도 & 가이드",
  description:
    "2026 대한민국 우리술 대축제(aT센터 제1전시장) 부스 배치도, 148개 주류·먹거리 부스 상세 정보, 가고 싶은 부스 즐겨찾기 및 하트 저장 웹앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased selection:bg-amber-200 selection:text-stone-900">
        {children}
      </body>
    </html>
  );
}
