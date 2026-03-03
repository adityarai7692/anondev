import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Board from '@/models/Board';
import Thread from '@/models/Thread';
import Post from '@/models/Post';
import { getClientIP, hashIP, getAnonId } from '@/lib/hash';
import { checkPostRateLimit } from '@/lib/rateLimit';
import { filterContent, sanitizeText } from '@/lib/filter';
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

  const body      = await req.json();
  const title     = sanitizeText(String(body.title     || '').slice(0, 200));
  const content   = String(body.content   || '').slice(0, 10000);
  const boardSlug = String(body.boardSlug || '');

  if (!title || title.length < 3)
    return NextResponse.json({ error: 'Title too short.' }, { status: 400 });

  const titleFilter = filterContent(title);
  if (!titleFilter.clean)
    return NextResponse.json({ error: titleFilter.reason }, { status: 400 });

  const contentFilter = filterContent(content);
  if (!contentFilter.clean)
    return NextResponse.json({ error: contentFilter.reason }, { status: 400 });

  const board = await Board.findOne({ slug: boardSlug });
  if (!board)
    return NextResponse.json({ error: 'Board not found.' }, { status: 404 });

  const thread = new Thread({ boardId: board._id, title });
  await thread.save();

  const anonId = getAnonId(ip, thread._id.toString());
  const post   = new Post({ threadId: thread._id, content, ipHash, anonId });
  await post.save();

  board.threadCount    += 1;
  board.postCount      += 1;
  board.lastActivityAt  = new Date();
  board.score           = calculateScore(board.threadCount, board.postCount);
  if (board.status === 'trial' && shouldPromote(board.threadCount, board.postCount)) {
    board.status = 'permanent';
  }
  await board.save();

  return NextResponse.json({ threadId: thread._id.toString(), anonId }, { status: 201 });
}