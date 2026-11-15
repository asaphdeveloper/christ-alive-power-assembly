import mongoose from 'mongoose';

const mapLocationSchema = new mongoose.Schema(
  {
    longitude: {
      type: Number,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
      default: null,
    },
    latitude: {
      type: Number,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
      default: null,
    },
  },
  { _id: false },
);

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
    username: {
      type: String,
      required: [true, 'Please provide your username'],
      unique: [true, 'Username already exists'],
      lowercase: true,
      trim: true,
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
      type: mapLocationSchema,
      default: () => ({}),
      validate: {
        validator: (location) => {
          if (!location) return true;
          const hasLongitude =
            location.longitude !== null && location.longitude !== undefined;
          const hasLatitude =
            location.latitude !== null && location.latitude !== undefined;
          return hasLongitude === hasLatitude;
        },
        message: 'Provide both longitude and latitude',
      },
    },
  },
  { timestamps: true },
);

const Branch = mongoose.model('Branch', branchSchema);

export default Branch;
