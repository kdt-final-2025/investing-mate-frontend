'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/hooks/useUser';
import AvatarMenu from '@/components/Profile/avatarMenu';
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
// backend에서 내려주는 status 값
type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export default function ProfilePage() {
  const supabase = createClient();
  const { avatarUrl, userName, userEmail } = useUser(supabase);

  const [comments, setComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // 기자 신청 상태
  const [appStatus, setAppStatus] = useState<ApplicationStatus | null>(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // TODO: 실제 API 베이스 URL 설정
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

  // 내 기자 신청 상태 조회
  useEffect(() => {
    async function fetchAppStatus() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError || !session) return;
        const token = session.access_token;
        const res = await fetch(`${API_BASE}/reporter-applications/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const json = await res.json();
          setAppStatus(json.status as ApplicationStatus);
          if (json.status === 'PENDING') setApplied(true);
          if (json.status === 'APPROVED') setApplied(true);
        }
      } catch (e) {
        console.error('Failed to fetch application status', e);
      }
    }
    fetchAppStatus();
  }, [API_BASE, supabase]);

  // 기자 신청 핸들러
  const handleApply = async () => {
    setApplying(true);
    setApplyError(null);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('로그인이 필요합니다.');
      }
      const token = session.access_token;

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
      setAppStatus('PENDING');
    } catch (e: any) {
      setApplyError(e.message);
      setShowErrorModal(true);
    } finally {
      setApplying(false);
    }
  };

  return (
      <LoadingWrapper isLoading={loadingComments || loadingPosts} error={null}>
        <div className="min-h-screen bg-[#131722] text-white">
          <nav className="bg-[#1E222D] border-b border-[#363A45]">
            <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-16">
              <Link href="/main" className="text-white font-bold">
                ← 메인페이지로
              </Link>
              <AvatarMenu
                  avatarUrl={avatarUrl}
                  userName={userName}
                  userEmail={userEmail}
              />
            </div>
          </nav>

          <div className="max-w-4xl mx-auto p-6 space-y-6">
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
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold">{userName}</h1>
                    {appStatus === 'APPROVED' && (
                        <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-green-500 text-white">
                      기자
                    </span>
                    )}
                    {appStatus === 'PENDING' && (
                        <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-yellow-500 text-black">
                      신청중
                    </span>
                    )}
                  </div>
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
            </section>

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

            {showErrorModal && applyError && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="absolute inset-0 bg-black opacity-50" />
                  <div className="relative bg-[#1E222D] rounded-lg p-6 max-w-sm w-full mx-4 text-white z-10">
                    <h3 className="text-lg font-semibold mb-2">오류</h3>
                    <p className="text-sm mb-4">{applyError}</p>
                    <button
                        onClick={() => {
                          setShowErrorModal(false);
                          setApplyError(null);
                        }}
                        className="mt-2 w-full bg-[#2A2E39] py-2 rounded-lg hover:bg-[#373f4d] transition"
                    >
                      닫기
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
      </LoadingWrapper>
  );
}