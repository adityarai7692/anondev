import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Thread from '@/models/Thread';
import Post from '@/models/Post';
import Board from '@/models/Board';
import { getClientIP, hashIP, getAnonId } from '@/lib/hash';
import { checkPostRateLimit } from '@/lib/rateLimit';
import { filterContent } from '@/lib/filter';
import { calculateScore, shouldPromote } from '@/lib/boardUtils';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  await connectDB();
  const ip     = getClientIP(req);
  const ipHash = hashIP(ip);

  const rateCheck = checkPostRateLimit(ipHash);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: `Rate limited. Wait ${rateCheck.retryAfter}s.` },
      { status: 429 }
    );
  }

  const body     = await req.json();
  const content  = String(body.content  || '').slice(0, 10000).trim();
  const threadId = String(body.threadId || '');

  if (!content)
    return NextResponse.json({ error: 'Empty post.' }, { status: 400 });

  const contentFilter = filterContent(content);
  if (!contentFilter.clean)
    return NextResponse.json({ error: contentFilter.reason }, { status: 400 });

  const thread = await Thread.findById(threadId);
  if (!thread)
    return NextResponse.json({ error: 'Thread not found.' }, { status: 404 });

  const anonId = getAnonId(ip, threadId);
  const post   = new Post({ threadId, content, ipHash, anonId });
  await post.save();

  thread.lastBumpAt = new Date();
  await thread.save();

  const board = await Board.findById(thread.boardId);
  if (board) {
    board.postCount      += 1;
    board.lastActivityAt  = new Date();
    board.score           = calculateScore(board.threadCount, board.postCount);
    if (board.status === 'trial' && shouldPromote(board.threadCount, board.postCount)) {
      board.status = 'permanent';
    }
    await board.save();
  }

  return NextResponse.json({ success: true, anonId }, { status: 201 });
}