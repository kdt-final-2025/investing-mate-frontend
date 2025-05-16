// src/apps/s3.ts (프론트엔드 함수)
import { API_BASE } from '@/service/baseAPI';

/**
 * 파일을 S3에 업로드하고, 반환된 imageUrl을 리턴합니다.
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/s3/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Upload failed');
  }

  const { imageUrl } = await res.json();
  return imageUrl;
}

/**
 * imageUrl을 파라미터로 받아 S3 객체를 삭제하는 함수입니다.
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  const res = await fetch(
    `${API_BASE}/s3/delete?imageUrl=${encodeURIComponent(imageUrl)}`,
    { method: 'DELETE' }
  );
  if (!res.ok) {
    throw new Error('Delete failed');
  }
}
