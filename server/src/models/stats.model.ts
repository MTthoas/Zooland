import mongoose, { Document, Schema } from 'mongoose';

export interface IStats extends Document {
  date: Date;
  visitors: number;
  visitorsLive: number;
  hour: number;
  spaceId: string;
  spaceName?: string;
}

const StatsSchema: Schema = new Schema({
  date: { type: Date, required: true },
  visitors: { type: Number, required: true },
  visitorsLive: { type: Number, required: true },
  hour: { type: Number, required: true },
  spaceId: { type: String, required: true },
  spaceName: { type: String, required: false }
});

export default mongoose.model<IStats>('Stats', StatsSchema);
