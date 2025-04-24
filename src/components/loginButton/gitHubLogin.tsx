"use client";

import { createClient } from "@/utils/supabase/client";

const GitHubLogin = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  console.log(data);

  if (error) {
    console.log(error);
  }
};

export function GitHubLoginButton() {
  return (
    <button type="button" onClick={GitHubLogin} className="github">
      GitHub로 로그인
    </button>
  );
}