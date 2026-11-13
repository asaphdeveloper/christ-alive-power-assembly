import mongoose from 'mongoose';
import validator from 'validator';

const branchSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: [true, 'Please provide the state'],
      trim: true,
    },
    leadPastor: {
      type: String,
      required: [true, 'Please provide the lead pastor'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Please provide the country'],
      trim: true,
    },
    localGovernmentArea: {
      type: String,
      required: [true, 'Please provide the local government area'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide the address'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
    },
    alternativePhoneNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    slogan: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide the branch name'],
      trim: true,
    },
    mapLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: (coordinates) =>
            coordinates.length === 2 &&
            coordinates[0] >= -180 &&
            coordinates[0] <= 180 &&
            coordinates[1] >= -90 &&
            coordinates[1] <= 90,
          message: 'Map location must be [longitude, latitude]',
        },
      },
    },
  },
  { timestamps: true },
);

branchSchema.index({ mapLocation: '2dsphere' });

const Branch = mongoose.model('Branch', branchSchema);

export default Branch;
