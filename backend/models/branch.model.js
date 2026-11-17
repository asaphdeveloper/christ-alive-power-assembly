import mongoose from 'mongoose';

const mapLocationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (coordinates) => {
          if (!Array.isArray(coordinates) || coordinates.length !== 2) return false;
          const [longitude, latitude] = coordinates;
          return Number.isFinite(longitude) && Number.isFinite(latitude)
            && longitude >= -180 && longitude <= 180
            && latitude >= -90 && latitude <= 90;
        },
        message: 'Provide valid longitude and latitude coordinates',
      },
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
      trim: true,
      default: '',
    },
    alternativePhoneNumber: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      unique: [true, 'Username already exists'],
      lowercase: true,
      trim: true,
      sparse: true,
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
      required: [true, 'Please provide the branch map location'],
    },
  },
  { timestamps: true },
);

const Branch = mongoose.model('Branch', branchSchema);

export default Branch;
