// server/models/Requirement.js
import mongoose from 'mongoose';

const requirementSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  demandDetails: {
    cropType: { type: String, required: true },
    qualityGrade: { type: String, enum: ['A', 'B', 'C', 'Any'], required: true },
    qualitySpecs: {
      minSize: Number,
      maxSize: Number,
      blemishesTolerance: { type: String, enum: ['None', 'Minor', 'Moderate'] },
      colorRequirement: String,
      photos: [String]
    },
    quantity: {
      totalAmount: { type: Number, required: true },
      deliveryPattern: { type: String, enum: ['Daily', 'Weekly', 'One-time'], required: true },
      dailyAmount: Number,
      duration: Number
    },
    pricing: {
      offerPrice: { type: Number, required: true },
      priceType: { type: String, enum: ['Fixed', 'Market-linked'] },
      paymentTerms: { type: String, enum: ['Advance 20%, Balance on delivery', 'Full on delivery', 'Net 7 days'] }
    },
    logistics: {
      deliveryLocation: {
        address: String,
        lat: Number,
        lng: Number
      },
      preferredDeliveryTime: String,
      transportArrangement: { type: String, enum: ['Company arranges', 'Farmer arranges', 'Platform arranges'] }
    },
    timeline: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      flexible: Boolean
    }
  },
  preferences: {
    maxFarmers: Number,
    minQuantityPerFarmer: Number,
    preferredRegions: [String],
    certificationRequired: [String]
  },
  fulfillment: {
    totalRequired: Number,
    matched: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Partial', 'Complete'], default: 'Pending' }
  },
  status: { type: String, enum: ['Active', 'Completed', 'Cancelled'], default: 'Active' }
}, { timestamps: true });

const Requirement = mongoose.models.Requirement || mongoose.model('Requirement', requirementSchema);
export default Requirement;
