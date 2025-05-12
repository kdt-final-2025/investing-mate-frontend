// src/app/profile/page.tsx
'use client';

import Link from 'next/link';
import LoadingWrapper from '@/components/LoadingWrapper';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/hooks/useProfile/useUser';
import { useComments } from '@/hooks/useProfile/useComments';
import { useLikePosts } from '@/hooks/useProfile/useLikePosts';
import { useReporterApplication } from '@/hooks/useProfile/useReporterApplication';

export default function ProfilePage() {
  const supabase = createClient();
  const { avatarUrl, userName, userEmail } = useUser(supabase);

  const { comments, loading: loadingComments } = useComments();
  const { posts, loading: loadingPosts } = useLikePosts();

  // useReporterApplication 하나로 isAdmin, isReporter, 로딩, 상태, 핸들러 전부 반환
  const {
    isAdmin,
    isReporter,
    loadingAdmin,
    loadingReporter,
    status,
    applying,
    applied,
    error,
    showError,
    apply,
    closeError,
  } = useReporterApplication();

  // 전체 로딩 여부
  const isLoading =
    loadingComments || loadingPosts || loadingAdmin || loadingReporter;

  return (
    <LoadingWrapper isLoading={isLoading} error={null}>
      <div className="min-h-screen bg-[#131722] text-white">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* 프로필 헤더 */}
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

                  {/* Badge 렌더링: isAdmin → isReporter → PENDING */}
                  {isAdmin ? (
                    <span
                      className="
                         inline-block text-xs font-semibold px-2 py-1 rounded-full
                         border border-purple-500 text-purple-400
                         shadow-[0_0_8px_rgba(139,92,246,0.7)]
                         [text-shadow:0_0_4px_rgba(139,92,246,0.8)]
                       "
                    >
                      관리자
                    </span>
                  ) : isReporter ? (
                    <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-green-500 text-white">
                      기자
                    </span>
                  ) : status === 'PENDING' ? (
                    <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-yellow-500 text-black">
                      신청중
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-gray-400 break-all">{userEmail}</p>
              </div>
            </div>

            {/* 관리자·기자가 아닌 사람만 신청 버튼 */}
            {!isAdmin && !isReporter && (
              <button
                onClick={apply}
                disabled={applying || applied}
                className="
                   w-full bg-[#2A2E39] text-white font-semibold py-2 rounded-lg
                   hover:bg-[#373f4d] transition disabled:opacity-50
                 "
              >
                {applying
                  ? '신청 중…'
                  : applied
                    ? '신청 완료'
                    : '기자 신청하기'}
              </button>
            )}
          </section>

          {/* 내 댓글 / 게시글 */}
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
              <h2 className="text-xl font-semibold">좋아요한 게시글 목록</h2>
              {loadingPosts ? (
                <p className="text-gray-400">불러오는 중…</p>
              ) : posts && posts.length > 0 ? (
                // 최신 순 정렬 후 10개만
                posts
                  .slice() // 원본 건드리지 않기 위해 얕은 복사
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .slice(0, 10)
                  .map((p) => (
                    <div
                      key={p.postId}
                      className="border-b border-gray-700 pb-2"
                    >
                      <Link
                        href={`/posts/${p.postId}`} // postId 대신 boardId 사용
                        className="font-medium hover:underline"
                      >
                        {p.postTitle} {/* PostsLikedResponse.postTitle */}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1">
                        <span>{new Date(p.createdAt).toLocaleString()}</span>
                        <span className="ml-2">💬 {p.commentCount}</span>
                        <span className="ml-2">👍 {p.likeCount}</span>
                        <span className="ml-2">👁️ {p.viewCount}</span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-400">좋아요한 게시글이 없습니다.</p>
              )}
            </section>
          </div>

          {/* 에러 모달 */}
          {showError && error && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="absolute inset-0 bg-black opacity-50" />
              <div className="relative bg-[#1E222D] rounded-lg p-6 max-w-sm w-full mx-4 text-white z-10">
                <h3 className="text-lg font-semibold mb-2">오류</h3>
                <p className="text-sm mb-4">{error}</p>
                <button
                  onClick={closeError}
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
