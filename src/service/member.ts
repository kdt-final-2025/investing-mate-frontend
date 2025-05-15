// src/service/member.ts
import { API_BASE } from './baseAPI';

export type MemberResponse = {
  userId: string;
  email: string;
  fullname: string;
  role: 'GENERAL' | 'REPORTER' | 'ADMINISTRATOR';
};

export type RoleResponse = {
  role: 'GENERAL' | 'REPORTER' | 'ADMINISTRATOR';
};

// JWT를 이용해 사용자 프로비저닝(업서트)
export async function fetchCurrentMember(
  accessToken: string
): Promise<MemberResponse> {
  const res = await fetch(`${API_BASE}/member/me`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`회원 정보 조회 실패 (${res.status}): ${text}`);
  }
  return res.json();
}

// 현재 사용자의 역할만 가져옴
export async function fetchMyRole(accessToken: string): Promise<RoleResponse> {
  const res = await fetch(`${API_BASE}/member/me/role`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`역할 조회 실패 (${res.status}): ${text}`);
  }
  return res.json();
}
