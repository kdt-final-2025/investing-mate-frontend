// src/app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ClientNavWrapper from '@/components/ClientNavWrapper'
import AlertSubscriber from '@/components/AlertSubscriber'  // 추가

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Red Light - 쉽고 빠른 주식·금융 정보와 커뮤니티',
  description:
    '실시간 뉴스, 경제 지표, 다양한 주식 차트와 투자자 커뮤니티까지! 초보부터 전문가까지 모두를 위한 새로운 금융 플랫폼을 경험해보세요.',
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
    <body>
      {/* 전역 알림 구독 컴포넌트 */}
      <AlertSubscriber />

      {/* 레이아웃 최상단에 네비바 */}
      <ClientNavWrapper />

      {/* 페이지 본문 */}
      {children}
    </body>
    </html>
  )
}
