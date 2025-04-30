// mock/boards.mock.ts

export type Board = {
  id: number;
  boardName: string;
  postCount: number;
};

export const MOCK_BOARDS: Board[] = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  boardName: `Mock Board ${index + 1}`,
  postCount: Math.floor(Math.random() * 100),
}));

export async function fetchMockBoards() {
  return new Promise<{ BoardResponse: Board[] }>((resolve) =>
    setTimeout(() => resolve({ BoardResponse: MOCK_BOARDS }), 300)
  );
}
