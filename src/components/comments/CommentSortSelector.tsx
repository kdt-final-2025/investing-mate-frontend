'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

interface Props {
  sortOrder: string;
  onChange: (newSort: string) => void;
}

const options = ['최신순', '좋아요순'];

export default function CommentSortSelector({ sortOrder, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleSelect = (opt: string) => {
    onChange(opt);
    setOpen(false);
  };

  return (
    <div className="relative mb-4 z-10">
      {/* 드롭다운/슬라이딩 버튼 공통 */}
      <motion.button
        onClick={handleToggle}
        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded border border-white shadow-sm"
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* 유튜브 스타일 재생 아이콘 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          aria-hidden="true"
        >
          <path d="M6 15h12v2H6v-2zm3-6l3-3 3 3h-6z" />
        </svg>
        정렬기준
      </motion.button>

      {/* 옵션 메뉴 (PC/모바일 동일) */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute mt-2 left-0 w-full sm:w-auto bg-white border rounded shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {options.map((opt) => {
              const isActive = sortOrder === opt;
              return (
                <motion.button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-black'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {opt}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
