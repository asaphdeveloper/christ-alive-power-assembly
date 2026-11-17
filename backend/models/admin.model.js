import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const ADMIN_ROLES = [
  'headquater-media-admin',
  'general-overseer',
  'developer',
  'branch-media-admin',
];

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    username: {
      type: String,
      required: [true, 'Please provide your username'],
      unique: [true, 'Username already exists'],
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true, default: '' },
    alternatePhone: { type: String, trim: true, default: '' },
    role: {
      type: String,
      enum: {
        values: ADMIN_ROLES,
        message: 'Role must be one of the supported admin roles',
      },
      required: [true, 'Please provide an admin role'],
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      default: null,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: String,
  },
  { timestamps: true },
);

adminSchema.index(
  { branch: 1 },
  {
    unique: true,
    partialFilterExpression: { role: 'branch-media-admin', branch: { $type: 'objectId' } },
  },
);

adminSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

adminSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();
  if (update.password) {
    this.set({ passwordChangedAt: Date.now() - 1000 });
  }
});

adminSchema.methods.comparePasswords = async function (password, savedPassword) {
  return bcrypt.compare(password, savedPassword);
};

adminSchema.methods.passwordChangedAfter = function (issuedTimestamp) {
  if (!this.passwordChangedAt) return false;
  const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
  return changedTimestamp > issuedTimestamp;
};

adminSchema.methods.hashPasswordResetToken = function (resetToken) {
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
