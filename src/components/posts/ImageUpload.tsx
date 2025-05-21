import React, { useRef, DragEvent } from 'react';
import { Paperclip, Trash2 } from 'lucide-react';
import { usePostsImage } from '@/hooks/usePosts/usePostsImage';

interface ImageUploadProps {
  boardId: number;
  fields: { id: string; url: string }[];
  append: (value: { url: string }) => void;
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
    handleImageDelete,
  } = usePostsImage(boardId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const url = await handleImageUpload(file);
    append({ url });
    e.target.value = '';
  };

  const onDrop = async (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length === 0) return;
    const file = e.dataTransfer.files[0];
    const url = await handleImageUpload(file);
    append({ url });
  };

  return (
    <section className="mb-6 border rounded bg-[#131722] p-4">
      {/* 드래그 영역 */}
      <div
        className="flex items-center justify-center p-6 border-2 border-gray-600 border-dashed rounded bg-[#1f2733] cursor-pointer hover:bg-[#262f38]"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <Paperclip className="text-gray-400 mr-2" />
        <span className="text-sm text-gray-400">
          파일을 드래그하거나 '첨부파일 등록'을 클릭하세요
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={onFileSelect}
      />

      {/* 업로드된 파일 목록 */}
      {fields.length > 0 && (
        <div className="mt-4 border rounded bg-[#131722]">
          {fields.map((f, i) => (
            <div
              key={f.id}
              className="flex items-center justify-between p-2 border-b last:border-b-0 hover:bg-[#262f38]"
            >
              <div className="flex items-center">
                <Paperclip className="text-gray-400 mr-2" />
                <span className="text-sm text-white truncate">
                  {f.url.split('/').pop()}
                </span>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await handleImageDelete(f.url);
                  remove(i);
                }}
                disabled={uploading}
                className="hover:opacity-80"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploadError && (
        <p className="mt-2 text-sm text-red-400">{uploadError}</p>
      )}
    </section>
  );
}
