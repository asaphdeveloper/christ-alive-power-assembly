import mongoose from 'mongoose';

const resourceUsageSchema = new mongoose.Schema({
  month: { type: String, required: true, unique: true },
  reads: { type: Number, default: 0 },
  writes: { type: Number, default: 0 },
});

const ResourceUsage = mongoose.model('ResourceUsage', resourceUsageSchema);
export default ResourceUsage;
