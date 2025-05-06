import { Metadata } from 'next';
import CreatePostForm from '@/../src/components/posts/CreatePostForm';

export const metadata: Metadata = {
  title: '게시글 작성',
  description: '새로운 게시글을 작성하는 페이지입니다.',
};

export default function CreatePostPage() {
  return (
    <div className="min-h-screen bg-[#131722] text-white container mx-auto p-6">
      <div className="bg-[#1E222D] p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-6">게시글 작성</h1>
        <CreatePostForm />
      </div>
    </div>
  );
}
