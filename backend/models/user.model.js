import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

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

userSchema.methods.comparePasswords = async function (
  candidatePassword,
  savedPassword,
) {
  return await bcrypt.compare(candidatePassword, savedPassword);
};

const User = mongoose.model('User', userSchema);

export default User;
