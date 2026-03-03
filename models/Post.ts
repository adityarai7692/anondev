import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
  threadId: mongoose.Types.ObjectId;
  content: string;
  ipHash: string;
  anonId: string;
  createdAt: Date;
}

const PostSchema = new Schema<IPost>({
  threadId: { type: Schema.Types.ObjectId, ref: 'Thread', required: true },
  content: { type: String, required: true, maxlength: 10000 },
  ipHash: { type: String, required: true },
  anonId: { type: String, required: true, maxlength: 6 },
  createdAt: { type: Date, default: Date.now },
});

PostSchema.index({ threadId: 1, createdAt: 1 });

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
export default Post;