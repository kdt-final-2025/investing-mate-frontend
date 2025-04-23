'use client'

import { useEffect, useRef } from 'react'

interface Window {
  TradingView: any;
}

declare const window: Window

export default function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined' && container.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: 'SPY',
          interval: 'D',
          timezone: 'Asia/Seoul',
          theme: 'dark',
          style: '1',
          locale: 'kr',
          toolbar_bg: '#1E222D',
          enable_publishing: false,
          hide_legend: false,
          allow_symbol_change: true,
          studies: [],
          container_id: container.current.id,
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <div 
      id="tradingview_widget"
      ref={container} 
      className="w-full h-full"
    />
  )
} 