// src/service/s3.ts
import { API_BASE } from './baseAPI'; // 기존 env 직접 참조 대신 공통 상수로 통일

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/s3/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `이미지 업로드 에러: ${res.status}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    return data.imageUrl;
  } else {
    const text = await res.text();
    const match = text.match(/https?:\/\/\S+/);
    return match ? match[0] : text.trim();
  }
}

export async function deleteImage(key: string): Promise<void> {
  const res = await fetch(`${API_BASE}/s3/upload/${key}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `이미지 삭제 에러: ${res.status}`);
  }
}
