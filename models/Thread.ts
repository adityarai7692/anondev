import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IThread extends Document {
  boardId: mongoose.Types.ObjectId;
  title: string;
  createdAt: Date;
  lastBumpAt: Date;
}

const ThreadSchema = new Schema<IThread>({
  boardId: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  createdAt: { type: Date, default: Date.now },
  lastBumpAt: { type: Date, default: Date.now },
});

ThreadSchema.index({ boardId: 1, lastBumpAt: -1 });

const Thread: Model<IThread> =
  mongoose.models.Thread || mongoose.model<IThread>('Thread', ThreadSchema);
export default Thread;