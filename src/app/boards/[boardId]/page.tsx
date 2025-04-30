import { BoardList } from '@/components/boards/BoardList';
import { getBoards } from '@/service/boards';

type Props = {
    params: {
        boardId: string;
    };
};

export default async function BoardDetailPage({ params }: Props) {
    const { boardId } = params;
    const boards = await getBoards('your_token_here'); // 필요 시 필터링 가능

    return (
        <div>
            <h1>게시판 상세: {boardId}</h1>
            <BoardList boards={boards} />
        </div>
    );
}
