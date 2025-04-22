'use client'

import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="h-screen flex flex-col bg-black overflow-hidden">
      <div className="flex-1 container mx-auto px-6 py-8 flex flex-col">
        <Card className="flex-1 bg-black/[0.96] relative overflow-hidden rounded-3xl border border-neutral-800">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
            size={800}
          />

          <div className="flex h-full items-center">
            {/* Left content */}
            <div className="flex-1 p-8 md:p-12 relative z-10">
              <h1 className="text-4xl md:text-7xl font-bold text-white leading-tight">
                Red Light 가 <br />밝히는 똑똑한 투자 세상
              </h1>
              <p className="mt-4 md:mt-6 text-base md:text-xl text-neutral-300 max-w-2xl">
                AI가 엄선한 뉴스, 경제 지표, 주식 차트, 그리고 커뮤니티까지!<br />Red Light와 함께 쉽고 똑똑하게 투자하세요!
              </p>
              <div className="mt-6 md:mt-8">
                <Link 
                  href="/main" 
                  className="inline-flex items-center px-6 py-3 text-lg font-medium text-black bg-white rounded-full hover:bg-neutral-200 transition-colors duration-200 transform hover:scale-105"
                >
                  시작하기
                  <svg 
                    className="w-5 h-5 ml-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right content */}
            <div className="flex-1 relative hidden lg:flex items-center justify-center">
              <div className="absolute inset-0">
                <SplineScene 
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Features 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Card className="p-4 md:p-6 bg-black/[0.96] border border-neutral-800 hover:border-neutral-700 transition-colors">
            <h3 className="text-base md:text-lg font-medium text-neutral-300 mb-2">실시간 데이터</h3>
            <p className="text-sm md:text-base text-neutral-400">최신 금융 데이터를 실시간으로 제공합니다.</p>
          </Card>
          <Card className="p-4 md:p-6 bg-black/[0.96] border border-neutral-800 hover:border-neutral-700 transition-colors">
            <h3 className="text-base md:text-lg font-medium text-neutral-300 mb-2">AI 분석</h3>
            <p className="text-sm md:text-base text-neutral-400">AI가 시장 동향을 분석하고 인사이트를 제공합니다.</p>
          </Card>
          <Card className="p-4 md:p-6 bg-black/[0.96] border border-neutral-800 hover:border-neutral-700 transition-colors">
            <h3 className="text-base md:text-lg font-medium text-neutral-300 mb-2">포트폴리오 관리</h3>
            <p className="text-sm md:text-base text-neutral-400">효율적인 포트폴리오 관리 도구를 제공합니다.</p>
          </Card>
        </div>
      </div>
    </main>
  )
}