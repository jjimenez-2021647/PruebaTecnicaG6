import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, index: true },
    attendeeName: { type: String, required: true, trim: true, maxlength: 120 },
    attendeeEmail: { type: String, required: true, trim: true, lowercase: true },
    attendeePhone: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
    registeredBy: { type: String, default: null },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false, toJSON: { virtuals: true } }
);

registrationSchema.index(
  { eventId: 1, attendeeEmail: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'active' } }
);

registrationSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export const Registration = mongoose.model('Registration', registrationSchema);
