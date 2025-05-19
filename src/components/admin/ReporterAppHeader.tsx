// File: src/components/admin/ReporterAppHeader.tsx
'use client';

import Link from 'next/link';
import React from 'react';

export default function ReporterAppHeader() {
  return (
    <>
      <div className="relative flex items-center justify-center py-2 mb-6">
        <Link
          href="/admin"
          className="absolute left-0 text-sm text-gray-300 hover:text-white"
        >
          ← 운영모드 대시보드로 돌아가기
        </Link>
        <h1 className="text-3xl font-semibold text-white">
          ReporterApply-Manage
        </h1>
      </div>
      <div className="mx-auto mb-8 h-1 w-32 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded" />
    </>
  );
}
