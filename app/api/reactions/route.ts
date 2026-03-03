import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Reaction from '@/models/Reaction';
import { getClientIP, hashIP } from '@/lib/hash';

export const runtime = 'nodejs';

const VALID_TYPES = ['like', 'dislike', '🔥', '💡', '😂', '👀', '💯'];

// GET — fetch all reaction counts for a list of postIds
// /api/reactions?postIds=id1,id2,id3
export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const raw     = searchParams.get('postIds') || '';
  const postIds = raw.split(',').filter(Boolean);

  if (postIds.length === 0)
    return NextResponse.json({});

  const ip     = getClientIP(req);
  const ipHash = hashIP(ip);

  // Get all reactions for these posts
  const reactions = await Reaction.find({
    postId: { $in: postIds },
  }).lean();

  // Build a map: postId → { type → count, myReactions: Set }
  const result: Record<string, { counts: Record<string, number>; mine: string[] }> = {};

  for (const postId of postIds) {
    result[postId] = { counts: {}, mine: [] };
  }

  for (const r of reactions) {
    const pid = r.postId.toString();
    if (!result[pid]) continue;
    result[pid].counts[r.type] = (result[pid].counts[r.type] || 0) + 1;
    if (r.ipHash === ipHash) {
      result[pid].mine.push(r.type);
    }
  }

  return NextResponse.json(result);
}

// POST — toggle a reaction
export async function POST(req: NextRequest) {
  await connectDB();
  const ip     = getClientIP(req);
  const ipHash = hashIP(ip);

  const body   = await req.json();
  const postId = String(body.postId || '');
  const type   = String(body.type   || '');

  if (!postId || !VALID_TYPES.includes(type))
    return NextResponse.json({ error: 'Invalid.' }, { status: 400 });

  // If like, remove dislike first (and vice versa) — can't have both
  if (type === 'like') {
    await Reaction.deleteOne({ postId, ipHash, type: 'dislike' });
  } else if (type === 'dislike') {
    await Reaction.deleteOne({ postId, ipHash, type: 'like' });
  }

  // Toggle: if already reacted with this type → remove it
  const existing = await Reaction.findOne({ postId, ipHash, type });
  if (existing) {
    await existing.deleteOne();
    return NextResponse.json({ action: 'removed', type });
  }

  await Reaction.create({ postId, ipHash, type });
  return NextResponse.json({ action: 'added', type });
}