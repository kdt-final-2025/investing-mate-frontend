'use client';

import {GoogleLoginButton} from "@/components/loginButton/googleLogin";
import {KakaoLoginButton} from "@/components/loginButton/kakaoLogin";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-[#131722] text-white px-4">
            <div className="w-full max-w-md bg-[#1E222D] rounded-2xl p-8 space-y-6">
                <h1 className="text-3xl font-bold text-center">로그인</h1>
                <div className="flex flex-col space-y-4">
                    <GoogleLoginButton/>
                    <KakaoLoginButton/>
                </div>
            </div>
        </main>
    );
}