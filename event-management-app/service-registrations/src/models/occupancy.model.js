import mongoose from 'mongoose';

const occupancySchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true },
    activeCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, versionKey: false }
);

export const Occupancy = mongoose.model('Occupancy', occupancySchema);
