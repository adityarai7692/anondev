import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Board from '@/models/Board';
import Thread from '@/models/Thread';
import Post from '@/models/Post';
import { TRIAL_DAYS, INACTIVE_DAYS, TRIAL_THRESHOLD_SCORE } from '@/lib/boardUtils';

export const runtime = 'nodejs';

async function deleteBoard(boardId: unknown) {
  const threads = await Thread.find({ boardId }).lean();
  for (const thread of threads) {
    await Post.deleteMany({ threadId: thread._id });
  }
  await Thread.deleteMany({ boardId });
  await Board.deleteOne({ _id: boardId });
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const now     = new Date();
  let deleted   = 0;

  const trialCutoff = new Date(now.getTime() - TRIAL_DAYS * 24 * 60 * 60 * 1000);
  const failedTrials = await Board.find({
    status:    'trial',
    createdAt: { $lt: trialCutoff },
    score:     { $lt: TRIAL_THRESHOLD_SCORE },
  }).lean();

  for (const board of failedTrials) {
    await deleteBoard(board._id);
    deleted++;
  }

  const inactiveCutoff = new Date(now.getTime() - INACTIVE_DAYS * 24 * 60 * 60 * 1000);
  const inactiveBoards = await Board.find({
    status:         'permanent',
    lastActivityAt: { $lt: inactiveCutoff },
  }).lean();

  for (const board of inactiveBoards) {
    await deleteBoard(board._id);
    deleted++;
  }

  return NextResponse.json({
    message:       `Cleanup complete. Deleted ${deleted} boards.`,
    deletedBoards: deleted,
    ranAt:         now.toISOString(),
  });
}