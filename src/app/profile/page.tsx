'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/hooks/useUser';
import AvatarMenu from '@/components/ui/avatarMenu';
import LoadingWrapper from '@/components/LoadingWrapper';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
}
interface Post {
  id: string;
  title: string;
  createdAt: string;
}

export default function ProfilePage() {
  const supabase = createClient();
  const { avatarUrl, userName, userEmail } = useUser(supabase);

  const [comments, setComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // TODO: 여기에 실제 API 베이스 URL 설정 (예: http://localhost:8080)
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || '';

  // 내 댓글 불러오기
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`${API_BASE}/api/comments`);
        const data: Comment[] = await res.json();
        setComments(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingComments(false);
      }
    }
    fetchComments();
  }, [API_BASE]);

  // 내 게시글 불러오기
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`${API_BASE}/api/posts`);
        const data: Post[] = await res.json();
        setPosts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingPosts(false);
      }
    }
    fetchPosts();
  }, [API_BASE]);

  // 기자 신청
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  const handleApply = async () => {
    setApplying(true);
    setApplyError(null);

    try {
      // 1) 세션에서 토큰 꺼내기
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('로그인이 필요합니다.');
      }
      const token = session.access_token;

      // 2) 백엔드에 POST 요청 (Authorization 헤더에 Bearer 토큰)
      const res = await fetch(`${API_BASE}/reporter-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`신청 실패: ${body || res.statusText}`);
      }
      setApplied(true);
    } catch (e: any) {
      setApplyError(e.message);
    } finally {
      setApplying(false);
    }
  };

  return (
    <LoadingWrapper isLoading={loadingComments || loadingPosts} error={null}>
      <div className="min-h-screen bg-[#131722] text-white">
        {/* 고정 네비게이션 */}
        <nav className="bg-[#1E222D] border-b border-[#363A45]">
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-16">
            <Link href="/" className="text-white font-bold">
              ← 홈으로
            </Link>
            <AvatarMenu
              avatarUrl={avatarUrl}
              userName={userName}
              userEmail={userEmail}
            />
          </div>
        </nav>

        {/* 본문 컨텐츠 */}
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* 프로필 박스 + 신청 버튼 */}
          <section className="bg-[#1E222D] rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-6">
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold">{userName}</h1>
                <p className="text-sm text-gray-400 break-all">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={handleApply}
              disabled={applying || applied}
              className="
                w-full
                bg-[#2A2E39]
                text-white
                font-semibold
                py-2
                rounded-lg
                hover:bg-[#373f4d]
                transition
                disabled:opacity-50
              "
            >
              {applying ? '신청 중…' : applied ? '신청 완료' : '기자 신청하기'}
            </button>
            {applyError && (
              <p className="text-red-500 text-sm text-center">{applyError}</p>
            )}
          </section>

          {/* 내 댓글 · 내 게시글 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-[#1E222D] rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold">내 댓글</h2>
              {loadingComments ? (
                <p className="text-gray-400">불러오는 중…</p>
              ) : comments.length > 0 ? (
                comments.map((c) => (
                  <div key={c.id} className="border-b border-gray-700 pb-2">
                    <p>{c.content}</p>
                    <time className="text-xs text-gray-500 block">
                      {new Date(c.createdAt).toLocaleString()}
                    </time>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">작성한 댓글이 없습니다.</p>
              )}
            </section>

            <section className="bg-[#1E222D] rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold">내 게시글</h2>
              {loadingPosts ? (
                <p className="text-gray-400">불러오는 중…</p>
              ) : posts.length > 0 ? (
                posts.map((p) => (
                  <div key={p.id} className="border-b border-gray-700 pb-2">
                    <Link
                      href={`/posts/${p.id}`}
                      className="font-medium hover:underline"
                    >
                      {p.title}
                    </Link>
                    <time className="text-xs text-gray-500 block">
                      {new Date(p.createdAt).toLocaleString()}
                    </time>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">작성한 게시글이 없습니다.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </LoadingWrapper>
  );
}
