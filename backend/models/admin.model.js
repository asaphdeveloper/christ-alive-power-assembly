import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const ADMIN_ROLES = [
  'headquater-media-admin',
  'jos-media-admin',
  'general-overseer',
  'developer',
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
    role: {
      type: String,
      enum: {
        values: ADMIN_ROLES,
        message: 'Role must be one of the supported admin roles',
      },
      required: [true, 'Please provide an admin role'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: 'Passwords are not the same',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: String,
  },
  { timestamps: true },
);

adminSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  this.passwordConfirm = undefined;
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
