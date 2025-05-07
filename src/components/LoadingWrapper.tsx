// components/LoadingWrapper.tsx
'use client';

import React, { ReactNode } from 'react';

interface LoadingWrapperProps {
  isLoading: boolean;
  error: string | null;
  /** 로딩·에러가 없을 때 렌더할 UI */
  children: ReactNode;
}

export default function LoadingWrapper({
  isLoading,
  error,
  children,
}: LoadingWrapperProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">Loading…</div>
    );
  }
  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }
  return <>{children}</>;
}
