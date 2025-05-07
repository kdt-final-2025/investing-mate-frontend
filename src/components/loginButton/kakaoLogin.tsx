'use client';

import { createClient } from '@/utils/supabase/client';

const Kakaologin = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  console.log(data);

  if (error) {
    console.log(error);
  }
};

export function KakaoLoginButton() {
  return (
    <button type="button" onClick={Kakaologin}>
      Kakao 로그인
    </button>
  );
}
