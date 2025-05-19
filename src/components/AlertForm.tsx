'use client'

import { useState } from 'react'
import { createAlert, StockAlertRequest } from '@/service/alerts'

interface AlertFormProps {
  symbol: string
  onSuccess?: () => void
}

export default function AlertForm({ symbol, onSuccess }: AlertFormProps) {
  const [targetPrice, setTargetPrice] = useState('')
  const [above, setAbove] = useState(true)
  const [error, setError] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const price = parseFloat(targetPrice)
    if (isNaN(price)) {
      setError('유효한 숫자를 입력하세요.')
      return
    }
    setLoading(true)
    try {
      await createAlert({ symbol, targetPrice: price, above })
      onSuccess?.()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-[#1E222D] p-6 rounded-lg w-full max-w-md space-y-4">
      <h2 className="text-xl font-bold">🔔 {symbol} 알림 설정</h2>
      <div>
        <label>목표 가격 (USD)</label>
        <input
          type="text"
          value={targetPrice}
          onChange={e => setTargetPrice(e.target.value)}
          className="w-full mt-1 p-2 rounded bg-[#131722]"
        />
      </div>
      <div className="flex items-center space-x-4">
        <label>
          <input
            type="radio"
            checked={above}
            onChange={() => setAbove(true)}
          /> 이상일 때
        </label>
        <label>
          <input
            type="radio"
            checked={!above}
            onChange={() => setAbove(false)}
          /> 이하일 때
        </label>
      </div>
      {error && <p className="text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 rounded hover:bg-blue-500"
      >
        {loading ? '생성 중…' : '알림 생성'}
      </button>
    </form>
  )
}
