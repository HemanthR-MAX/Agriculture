// server/models/Crop.js
import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  cropDetails: {
    cropType: { type: String, required: true, enum: ['Tomato', 'Onion', 'Potato', 'Cabbage', 'Carrot'] },
    variety: String,
    area: { type: Number, required: true },
    plantingDate: { type: Date, required: true },
    expectedHarvestDate: Date,
    fieldLocation: {
      lat: Number,
      lng: Number
    }
  },
  cultivation: {
    seedType: { type: String, enum: ['Hybrid', 'Traditional', 'Organic'] },
    irrigationPlan: String,
    fertilizersUsed: [String],
    pesticidesUsed: [String]
  },
  historical: {
    previousYield: Number,
    previousQuality: { type: String, enum: ['A', 'B', 'C'] }
  },
  prediction: {
    expectedYield: Number,
    confidence: { type: Number, min: 0, max: 1 },
    qualityDistribution: {
      gradeA: { type: Number, default: 0 },
      gradeB: { type: Number, default: 0 },
      gradeC: { type: Number, default: 0 }
    },
    maturityWindow: {
      start: Date,
      end: Date
    },
    qualityDistribution: {  // ← ADD
    gradeA: Number,
    gradeB: Number, 
    gradeC: Number
  },
  recommendedQuality: {   // ← ADD
    grade: String,
    successRate: Number,
    reasoning: String
  }
  },
  progressUpdates: [{
    date: { type: Date, default: Date.now },
    health: { type: String, enum: ['Good', 'Moderate', 'Poor'] },
    pestIssues: Boolean,
    weatherImpact: { type: String, enum: ['No issues', 'Some damage', 'Major damage'] },
    photos: [String]
  }],
  status: { type: String, enum: ['Growing', 'Ready', 'Harvested'], default: 'Growing' },
  allocatedQuantity: { type: Number, default: 0 }
}, { timestamps: true });

const Crop = mongoose.models.Crop || mongoose.model('Crop', cropSchema);
export default Crop;
