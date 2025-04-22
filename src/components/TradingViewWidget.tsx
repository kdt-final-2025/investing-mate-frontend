'use client'

import { useEffect, useRef } from 'react'

let tvScriptLoadingPromise: Promise<void>

export default function TradingViewWidget() {
  const onLoadScriptRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    onLoadScriptRef.current = createWidget

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script')
        script.id = 'tradingview-widget-loading-script'
        script.src = 'https://s3.tradingview.com/tv.js'
        script.type = 'text/javascript'
        script.onload = resolve as () => void

        document.head.appendChild(script)
      })
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current())

    return () => {
      onLoadScriptRef.current = null
    }

    function createWidget() {
      if (document.getElementById('tradingview_chart') && 'TradingView' in window) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: 'SPY',
          interval: 'D',
          timezone: 'Asia/Seoul',
          theme: 'dark',
          style: '1',
          locale: 'kr',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_chart',
        })
      }
    }
  }, [])

  return (
    <div className='tradingview-widget-container' style={{ height: '100%', width: '100%' }}>
      <div id='tradingview_chart' style={{ height: 'calc(100% - 32px)', width: '100%' }} />
      <div className="tradingview-widget-copyright">
        <a href="https://kr.tradingview.com/" rel="noopener noreferrer" target="_blank">
          <span className="text-xs text-gray-400">TradingView 제공</span>
        </a>
      </div>
    </div>
  )
} 