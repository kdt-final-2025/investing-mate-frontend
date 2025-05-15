// src/service/s3.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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
    // 텍스트에서 URL 부분만 추출
    const match = text.match(/https?:\/\/\S+/);
    return match ? match[0] : text.trim();
  }
}
