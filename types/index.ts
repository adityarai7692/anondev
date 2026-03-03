export interface IBoard {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  lastActivityAt: string;
  threadCount: number;
  postCount: number;
  score: number;
  status: 'trial' | 'permanent';
}

export interface IThread {
  _id: string;
  boardId: string;
  title: string;
  createdAt: string;
  lastBumpAt: string;
  postCount?: number;
}

export interface IPost {
  _id: string;
  threadId: string;
  content: string;
  anonId: string;
  createdAt: string;
}