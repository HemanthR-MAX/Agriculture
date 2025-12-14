// server/models/Contract.js
import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  requirementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Requirement', required: true },
  
  details: {
    cropType: String,
    qualityGrade: String,
    quantity: { type: Number, required: true },
    pricePerKg: { type: Number, required: true },
    totalAmount: Number,
    harvestDates: [Date],
    deliveryLocation: {
      address: String,
      lat: Number,
      lng: Number
    },
    pickupTime: String
  },
  
  payment: {
    advanceAmount: { type: Number, default: 0 },
    balanceAmount: Number,
    advancePaid: { type: Boolean, default: false },
    balancePaid: { type: Boolean, default: false },
    platformFee: { type: Number, default: 0 }
  },
  
  schedule: [{
    date: Date,
    quantity: Number,
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
  }],
  
  qualityCheck: {
    photos: [String],
    actualGrade: String,
    actualQuantity: Number,
    inspectorNotes: String,
    approved: Boolean
  },
  
  status: { type: String, enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Disputed', 'Cancelled'], default: 'Pending' },
  
  dispute: {
    raised: Boolean,
    raisedBy: { type: String, enum: ['Farmer', 'Company'] },
    reason: String,
    resolution: String,
    resolvedAt: Date
  }
}, { timestamps: true });

contractSchema.pre('save', function(next) {
  // Round to 2 decimal places
  this.details.totalAmount = Math.round(this.details.quantity * this.details.pricePerKg * 100) / 100;
  this.payment.advanceAmount = Math.round(this.details.totalAmount * 0.2 * 100) / 100;
  this.payment.balanceAmount = Math.round(this.details.totalAmount * 0.8 * 100) / 100;
  this.payment.platformFee = Math.round(this.details.totalAmount * 0.02 * 100) / 100;
  next();
});

const Contract = mongoose.models.Contract || mongoose.model('Contract', contractSchema);
export default Contract;
