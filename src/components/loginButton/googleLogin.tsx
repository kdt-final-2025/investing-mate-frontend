'use client';

import { createClient } from '@/utils/supabase/client';

const GoogleLogin = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  console.log(data);

  if (error) {
    console.log(error);
  }
};

export function GoogleLoginButton() {
  return (
    <button
      type="button"
      onClick={GoogleLogin}
      className="w-full py-3 rounded-full bg-white border border-gray-300 text-gray-700 text-center font-medium hover:bg-gray-100 cursor-pointer transition"
    >
      Google 로그인
    </button>
  );
}
