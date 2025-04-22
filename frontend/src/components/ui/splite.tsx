'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const LoadingSpinner = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
  </div>
)

// Spline 컴포넌트를 dynamic import로 로드
const Spline = dynamic(
  () => import('@splinetool/react-spline').then((mod) => mod.default),
  {
    ssr: false,
    loading: LoadingSpinner
  }
)

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <div className={`relative w-full h-full ${className || ''}`} style={{ minHeight: '500px' }}>
      <div className="absolute inset-0">
        <Spline scene={scene} />
      </div>
    </div>
  )
} 