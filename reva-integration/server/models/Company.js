// server/models/Company.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const companySchema = new mongoose.Schema({
  companyInfo: {
    companyName: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    companyType: { type: String, enum: ['Food Processing', 'Restaurant Chain', 'Retail', 'Export'] },
    gstNumber: { type: String, required: true },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    }
  },
  contactPerson: {
    name: { type: String, required: true },
    designation: String,
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true }
  },
  processingCapacity: {
    dailyCapacity: Number,
    storageCapacity: Number,
    processingTypes: [String]
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountName: String
  },
  verification: {
    documents: [String],
    verificationStatus: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Verified' }
  },
  password: { type: String, required: true },
  plantLocation: {
    lat: Number,
    lng: Number
  }
}, { timestamps: true });

companySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

companySchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Make sure there's only ONE export statement
const Company = mongoose.models.Company || mongoose.model('Company', companySchema);
export default Company;
