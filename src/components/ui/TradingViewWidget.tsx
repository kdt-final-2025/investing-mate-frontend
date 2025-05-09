'use client'

import { useEffect, useRef } from 'react'

interface TradingViewWidgetProps {
  symbol: string
  width?: string | number
  height?: string | number
}

export default function TradingViewWidget({
                                            symbol,
                                            width = '100%',
                                            height = '100%',
                                          }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // 1) div에 고유 id 지정
    const containerId = `tv_chart_${symbol}`
    containerRef.current.id = containerId
    containerRef.current.innerHTML = '' // 기존 내용 초기화

    // 2) 위젯 생성 함수
    const createWidget = () => {
      // @ts-ignore
      if (window.TradingView?.widget) {
        // @ts-ignore
        new window.TradingView.widget({
          container_id: containerId, // 문자열 id
          width,
          height,
          symbol: symbol,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'ko',
          toolbar_bg: '#1f2023',
          hide_side_toolbar: false,
          allow_symbol_change: true,
        })
      }
    }

    // 3) 스크립트가 이미 로드됐으면 바로 위젯 생성, 아니면 로드 후 생성
    if ((window as any).TradingView) {
      createWidget()
    } else {
      const existing = document.getElementById('tradingview-script')
      if (!existing) {
        const script = document.createElement('script')
        script.id = 'tradingview-script'
        script.src = 'https://s3.tradingview.com/tv.js'
        script.async = true
        script.onload = createWidget
        document.body.appendChild(script)
      } else {
        existing.addEventListener('load', createWidget)
      }
    }

    // cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [symbol, width, height])

  return <div ref={containerRef} style={{ width, height }} />
}
