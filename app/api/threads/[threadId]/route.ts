import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Thread from '@/models/Thread';
import Post from '@/models/Post';
import Board from '@/models/Board';
import Reaction from '@/models/Reaction';
import { getClientIP, getAnonId, hashIP } from '@/lib/hash';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  await connectDB();

  // ✅ unwrap
  const { threadId } = await params;

  const { searchParams } = new URL(req.url);
  const page = Math.max(
    1,
    parseInt(searchParams.get('page') || '1')
  );

  const limit = 50;
  const skip = (page - 1) * limit;

  const thread = await Thread.findById(threadId).lean();
  if (!thread)
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );

  const board = await Board.findById(thread.boardId).lean();

  const rawPosts = await Post.find({ threadId })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Post.countDocuments({ threadId });

  const ip     = getClientIP(req);
  const ipHash = hashIP(ip);
  const postIds = rawPosts.map((p) => p._id.toString());

  // Batch-fetch all reactions for this page of posts
  const reactions = await Reaction.find({
    postId: { $in: postIds },
  }).lean();

  // Build reaction map
  const reactionMap: Record<string, { counts: Record<string, number>; mine: string[] }> = {};
  for (const pid of postIds) {
    reactionMap[pid] = { counts: {}, mine: [] };
  }
  for (const r of reactions) {
    const pid = r.postId.toString();
    if (!reactionMap[pid]) continue;
    reactionMap[pid].counts[r.type] = (reactionMap[pid].counts[r.type] || 0) + 1;
    if (r.ipHash === ipHash) {
      reactionMap[pid].mine.push(r.type);
    }
  }

  const myAnonId = getAnonId(ip, threadId);

  const posts = rawPosts.map((p) => ({
    _id:       p._id,
    threadId:  p.threadId,
    content:   p.content,
    anonId:    p.anonId,
    createdAt: p.createdAt,
    reactions: reactionMap[p._id.toString()] || { counts: {}, mine: [] },
  }));

  return NextResponse.json({
    thread, board, posts, myAnonId, total, page,
    pages: Math.ceil(total / limit),
  });
}