import mongoose from 'mongoose';

const resourceDocumentSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        'sunday-bulletin',
        'wednesday-bulletin',
        'bible-study-guide',
        'friday-prayer-meeting',
        'sunday-school-guide',
      ],
      required: true,
      index: true,
    },
    name: { type: String, required: true, maxlength: 180 },
    objectKey: { type: String, required: true, unique: true },
    size: { type: Number, required: true, min: 1 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  { timestamps: true },
);

resourceDocumentSchema.index({ category: 1, createdAt: -1 });

const ResourceDocument = mongoose.model('ResourceDocument', resourceDocumentSchema);
export default ResourceDocument;
