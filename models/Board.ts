import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBoard extends Document {
  name: string;
  slug: string;
  createdAt: Date;
  lastActivityAt: Date;
  threadCount: number;
  postCount: number;
  score: number;
  status: 'trial' | 'permanent';
}

const BoardSchema = new Schema<IBoard>({
  name: { type: String, required: true, trim: true, maxlength: 64 },

  // unique already creates index — no need to add schema.index again
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 32,
  },

  createdAt: { type: Date, default: Date.now },
  lastActivityAt: { type: Date, default: Date.now },
  threadCount: { type: Number, default: 0 },
  postCount: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  status: { type: String, enum: ['trial', 'permanent'], default: 'trial' },
});

// Keep this composite index (this one is fine)
BoardSchema.index({ status: 1, lastActivityAt: -1 });

const Board: Model<IBoard> =
  mongoose.models.Board || mongoose.model<IBoard>('Board', BoardSchema);

export default Board;