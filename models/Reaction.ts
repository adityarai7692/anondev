import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReaction extends Document {
  postId: mongoose.Types.ObjectId;
  ipHash: string;
  type: 'like' | 'dislike' | '🔥' | '💡' | '😂' | '👀' | '💯';
  createdAt: Date;
}

const ReactionSchema = new Schema<IReaction>({
  postId:    { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  ipHash:    { type: String, required: true },
  type:      { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// One reaction type per user per post — user can like AND add emoji but not double-like
ReactionSchema.index({ postId: 1, ipHash: 1, type: 1 }, { unique: true });

const Reaction: Model<IReaction> =
  mongoose.models.Reaction || mongoose.model<IReaction>('Reaction', ReactionSchema);
export default Reaction;