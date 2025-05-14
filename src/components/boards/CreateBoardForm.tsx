// src/components/boards/CreateBoardForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { createBoard } from '@/service/boards';

type FormData = {
  boardName: string;
};

export default function CreateBoardForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { boardName: '' },
  });

  const onSubmit = async ({ boardName }: FormData) => {
    try {
      await createBoard({ boardName });
      router.push('/boards');
    } catch (err: unknown) {
      // 서버 에러는 form 에러로 표시
      alert(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto bg-[#1F2733] p-6 rounded-2xl shadow"
    >
      <label htmlFor="boardName" className="block text-white mb-2">
        게시판명
      </label>
      <input
        id="boardName"
        {...register('boardName', {
          required: '게시판명을 입력해주세요.',
          minLength: { value: 2, message: '최소 2자 이상 입력해주세요.' },
        })}
        disabled={isSubmitting}
        className="w-full p-2 rounded bg-[#2A2F36] text-white mb-1 focus:outline-none focus:ring-2 focus:ring-[#4A5B68]"
      />
      {errors.boardName && (
        <p className="text-red-500 mb-4">{errors.boardName.message}</p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 bg-[#3B4754] hover:bg-[#4A5B68] text-white font-semibold rounded transition ${
          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? '생성 중...' : '게시판 생성'}
      </button>
    </form>
  );
}
