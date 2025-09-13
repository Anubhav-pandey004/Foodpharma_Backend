const mongoose = require('mongoose');

const Mixed = mongoose.Schema.Types.Mixed;

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  productName: { type: String, required: true, maxlength: 200, trim: true },
  barcode: { type: String, maxlength: 64, trim: true },
  sources: {
    ingredientsText: { type: String, maxlength: 20000 },
    nutritionText: { type: String, maxlength: 20000 },
  },
  ai: {
    IngredientInsights: { type: [Mixed], default: [] },
    Data: { type: [Mixed], default: [] },
    NutritionFactsSummary: { type: Mixed },
    Rating: { type: Mixed },
    Verdict: { type: Mixed },
    alternatives: { type: [Mixed], default: [] },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000 },
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
