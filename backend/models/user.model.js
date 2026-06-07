import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: [true, 'Email already exists'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },

    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be either user or admin',
      },
      default: 'user',
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

    passwordChangedAt: {
      type: Date,
    },

    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  this.passwordConfirm = undefined;
});

userSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();

  if (update.password) {
    this.set({ passwordChangedAt: Date.now() - 1000 });
  }
});

userSchema.methods.comparePasswords = async function (password, savedPassword) {
  return await bcrypt.compare(password, savedPassword);
};

userSchema.methods.passwordChangedAfter = function (issuedTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return changedTimestamp > issuedTimestamp;
  }

  return false;
};

userSchema.methods.hashPasswordResetToken = function (resetToken) {
  const hashedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetToken = hashedResetToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
};

const User = mongoose.model('User', userSchema);

export default User;
