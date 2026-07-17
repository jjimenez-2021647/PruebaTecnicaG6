import mongoose from 'mongoose';

export const EVENT_STATUSES = ['draft', 'active', 'cancelled', 'completed'];

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    date: {
      type: Date,
      required: true,
    },
    place: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1200,
      default: '',
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: EVENT_STATUSES,
      default: 'active',
    },
    createdBy: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

export const Event = mongoose.model('Event', eventSchema);
