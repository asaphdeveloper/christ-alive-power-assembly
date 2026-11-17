import mongoose from 'mongoose';

const hymnSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'sunday-hymn' },
    draftNumber: { type: Number, min: 1, max: 99999, default: null },
    publishedNumber: { type: Number, min: 1, max: 99999, default: null },
    draftLyrics: { type: String, default: '', maxlength: 8000 },
    publishedLyrics: { type: String, default: '', maxlength: 8000 },
    publishedAt: Date,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true },
);

export default mongoose.model('Hymn', hymnSchema);
