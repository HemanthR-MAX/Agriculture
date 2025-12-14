
import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema({
  pin: {
    type: String,
    required: true
  },
  personalInfo: {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    village: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    language: { type: String, default: 'English' }
  },
  farmInfo: {
    totalLand: { type: Number, default: 0 },
    soilType: { type: String, default: '' },
    irrigationType: { type: String, default: '' },
    gpsLocation: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    }
  },
  bankDetails: {
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    accountHolderName: { type: String, default: '' },
    upiId: { type: String, default: '' }
  },
  role: {
    type: String,
    default: 'farmer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Farmer = mongoose.model('Farmer', farmerSchema);
export default Farmer;
