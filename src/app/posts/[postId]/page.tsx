import { fetchPostDetail } from '@/service/posts';
import PostDetailClient from '@/components/posts/PostDetailClient';
import type { Metadata } from 'next';

interface Props {
  params: { postId: string };
}

// 동적 메타데이터 생성 (SEO 최적화)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = params;
  const post = await fetchPostDetail(postId);

  return {
    title: post.postTitle,
    description: post.content.substring(0, 160), // 첫 160자를 설명으로 사용
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { postId } = params;

  // 서버에서 데이터 가져오기 (SSR)
  const post = await fetchPostDetail(postId);

  return (
    <div className="min-h-screen bg-[#131722] text-white container mx-auto p-6">
      <div className="bg-[#1E222D] p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">{post.postTitle}</h1>
        <p className="whitespace-pre-wrap mb-6">{post.content}</p>

        {/* 클라이언트 컴포넌트로 인터랙션 부분만 분리 */}
        <PostDetailClient initialPost={post} postId={postId} />
      </div>
    </div>
  );
}
