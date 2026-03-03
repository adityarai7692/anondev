import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Board from '@/models/Board';
import { getClientIP, hashIP } from '@/lib/hash';
import { checkBoardRateLimit } from '@/lib/rateLimit';
import { filterContent, generateSlug, sanitizeText } from '@/lib/filter';

export const runtime = 'nodejs';
export const revalidate = 30;

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page  = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = 20;
  const skip  = (page - 1) * limit;

  const boards = await Board.find({ status: { $in: ['trial', 'permanent'] } })
    .sort({ lastActivityAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Board.countDocuments({ status: { $in: ['trial', 'permanent'] } });

  return NextResponse.json({ boards, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const ip     = getClientIP(req);
  const ipHash = hashIP(ip);

  const limit = checkBoardRateLimit(ipHash);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: `Rate limited. Try again in ${limit.retryAfter}s.` },
      { status: 429 }
    );
  }

  const body = await req.json();
  const name = sanitizeText(String(body.name || '').slice(0, 64));

  if (!name || name.length < 3)
    return NextResponse.json({ error: 'Board name must be 3–64 characters.' }, { status: 400 });

  const filtered = filterContent(name);
  if (!filtered.clean)
    return NextResponse.json({ error: filtered.reason }, { status: 400 });

  let slug = generateSlug(name);
  if (!slug || slug.length < 2)
    return NextResponse.json({ error: 'Invalid board name.' }, { status: 400 });

  const existing = await Board.findOne({ slug });
  if (existing) slug = slug + '-' + Date.now().toString(36);

  const board = new Board({ name, slug });
  await board.save();

  return NextResponse.json({ slug: board.slug }, { status: 201 });
}