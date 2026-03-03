import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Board from '@/models/Board';
import Thread from '@/models/Thread';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  await connectDB();

  // ✅ unwrap params promise
  const { slug } = await context.params;

  const board = await Board.findOne({ slug }).lean();
  if (!board) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = 25;
  const skip = (page - 1) * limit;

  const threads = await Thread.find({ boardId: board._id })
    .sort({ lastBumpAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Thread.countDocuments({ boardId: board._id });

  return NextResponse.json({
    board,
    threads,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}