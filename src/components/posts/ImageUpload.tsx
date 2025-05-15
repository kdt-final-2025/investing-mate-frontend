// src/components/common/ImageUpload.tsx
'use client';

import React, { useRef } from 'react';
import { Paperclip, Trash2 } from 'lucide-react';
import { usePostsImage } from '@/hooks/usePosts/usePostsImage';

interface ImageUploadProps {
  boardId: number;
  fields: { id: string; url: string }[];
  append: (item: { url: string }) => void;
  remove: (index: number) => void;
}

export function ImageUpload({
  boardId,
  fields,
  append,
  remove,
}: ImageUploadProps) {
  const {
    uploading,
    error: uploadError,
    handleImageUpload,
  } = usePostsImage(boardId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileName = (url: string) => url.split('/').pop() || url;

  const processFiles = async (fileList: FileList | File[]) => {
    const files = Array.isArray(fileList) ? fileList : Array.from(fileList);
    for (const file of files) {
      if (fields.length >= 5) break;
      try {
        const url = await handleImageUpload(file);
        append({ url });
      } catch {
        // upload error handled in hook
      }
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) await processFiles(e.target.files);
    e.target.value = '';
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) await processFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <section className="mb-6 border rounded bg-[#1f2733] p-4">
      <h2 className="flex items-center text-lg font-semibold mb-2">
        <Paperclip className="mr-2 text-indigo-400" /> 첨부파일
      </h2>
      <ul className="list-disc list-inside text-sm text-gray-400 mb-4">
        <li>파일용량 5MB 이하, 최대 5개 업로드 가능</li>
        <li>허용 파일: gif, jpg, jpeg, bmp, png, pdf</li>
      </ul>
      <div
        className={`flex items-center p-6 border-2 border-dashed rounded bg-[#131722] ${
          uploading || fields.length >= 5
            ? 'opacity-50'
            : 'cursor-pointer hover:border-indigo-400'
        }`}
        onClick={() => {
          if (!uploading && fields.length < 5) fileInputRef.current?.click();
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || fields.length >= 5}
          className="px-3 py-1 border border-indigo-400 rounded text-indigo-400 mr-3 disabled:opacity-50"
        >
          첨부파일 등록
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          disabled={uploading || fields.length >= 5}
          onChange={onFileChange}
          className="hidden"
        />
        <span className="text-gray-400">버튼 클릭 또는 파일 드래그</span>
      </div>
      {uploadError && (
        <p className="text-red-500 text-sm mt-2">{uploadError}</p>
      )}
      {fields.length > 0 && (
        <div className="mt-4 border rounded bg-[#131722]">
          {fields.map((f, i) => (
            <div
              key={f.id}
              className="flex items-center justify-between p-2 border-b last:border-b-0 hover:bg-[#262f38]"
            >
              <div className="flex items-center">
                <Paperclip className="text-gray-400 mr-2" />
                <span className="text-sm text-white">{getFileName(f.url)}</span>
              </div>
              <button type="button" onClick={() => remove(i)}>
                <Trash2 className="text-red-500" size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
