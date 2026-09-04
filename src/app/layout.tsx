import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning 은 한 단계만 적용되므로 html/body 둘 다 붙인다.
    // 브라우저 확장이 <body> 에 style 을 끼워 넣는 경우가 흔해 그걸로 하이드레이션 경고가 뜬다.
    <html lang="ko" suppressHydrationWarning className="h-full">
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col font-sans antialiased"
      >
        <ThemeProvider>
          {/* 모바일에서는 화면 전체가 공책이라 머리말·꼬리말을 두지 않는다. */}
          <div className="hidden lg:block">
            <SiteHeader />
          </div>
          <main className="mx-auto w-full max-w-6xl flex-1 lg:px-5 lg:py-10">
            {children}
          </main>
          <div className="hidden lg:block">
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
