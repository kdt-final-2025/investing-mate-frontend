// src/app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server';
import { fetchCurrentMember } from '@/service/member';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/main';

  if (code) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.session) {
      // 1) 백엔드에서 사용자 정보를 미리 조회
      try {
        await fetchCurrentMember(data.session.access_token);
      } catch (e) {
        console.error('회원 정보 조회 중 오류:', e);
      }
      // 2) 리다이렉트
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
