'use client'

import { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export default function AlertModal({ isOpen, onClose, children }: AlertModalProps) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[#1E222D] rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  )
}
