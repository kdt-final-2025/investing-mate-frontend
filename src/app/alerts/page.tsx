'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import AlertForm from '@/components/AlertForm'

export default function AlertCreatePage() {
  const params = useSearchParams()
  const router = useRouter()
  const symbol = params.get('symbol')

  if (!symbol) {
    // URL에 symbol 없으면 그냥 홈으로 리다이렉트
    router.replace('/')
    return null
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#131722]">
      <AlertForm symbol={symbol} onSuccess={() => router.push('/alerts/list')} />
    </main>
  )
}
