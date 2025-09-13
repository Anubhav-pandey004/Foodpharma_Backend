const Report = require('../models/reportModel');

function sanitizeText(s, max = 1000) {
  if (typeof s !== 'string') return undefined;
  const trimmed = s.trim();
  const stripped = trimmed.replace(/<[^>]*>/g, '');
  return stripped.slice(0, max);
}

exports.createReport = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, error: true, message: 'Unauthorized' });

    const body = req.body || {};
    let { productName, barcode, ingredientsText, nutritionText, ai } = body;

    if (typeof productName !== 'string' || !productName.trim()) {
      return res.status(400).json({ success: false, error: true, message: 'productName is required' });
    }

    productName = sanitizeText(productName, 200);

    if (typeof barcode === 'string') {
      barcode = barcode.trim().slice(0, 64);
      if (!/^[\w\-]*$/.test(barcode)) barcode = undefined;
    } else {
      barcode = undefined;
    }

    if (typeof ingredientsText === 'string') ingredientsText = sanitizeText(ingredientsText, 20000);
    else ingredientsText = undefined;

    if (typeof nutritionText === 'string') nutritionText = sanitizeText(nutritionText, 20000);
    else nutritionText = undefined;

    if (typeof ai !== 'object' || ai === null) ai = {};

    const payload = {
      user: userId,
      productName,
      barcode,
      sources: {
        ingredientsText,
        nutritionText,
      },
      ai: {
        IngredientInsights: Array.isArray(ai.IngredientInsights) ? ai.IngredientInsights : [],
        Data: Array.isArray(ai.Data) ? ai.Data : [],
        NutritionFactsSummary: ai.NutritionFactsSummary || {},
        Rating: ai.Rating || {},
        Verdict: ai.Verdict || {},
        alternatives: Array.isArray(ai.alternatives) ? ai.alternatives : [],
      },
    };

    const doc = await Report.create(payload);
    return res.status(201).json({ success: true, error: false, message: 'Report saved', data: { id: doc._id } });
  } catch (e) {
    return res.status(500).json({ success: false, error: true, message: 'Internal server error' });
  }
};



exports.listReports = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, error: true, message: 'Unauthorized' });

    let { page = '1', limit = '10' } = req.query || {};
    page = parseInt(page, 10); limit = parseInt(limit, 10);
    if (!Number.isFinite(page) || page < 1) page = 1;
    if (!Number.isFinite(limit) || limit < 1 || limit > 50) limit = 10;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Report.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select({ productName: 1, barcode: 1, createdAt: 1, })
        .lean(),
      Report.countDocuments({ user: userId }),
    ]);

    return res.status(200).json({ success: true, error: false, data: { items, page, limit, total } });
  } catch (e) {
    return res.status(500).json({ success: false, error: true, message: 'Internal server error' });
  }
};

exports.getReport = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, error: true, message: 'Unauthorized' });
    const id = req.params.id;

    const doc = await Report.findOne({ _id: id, user: userId }).lean();
    if (!doc) return res.status(404).json({ success: false, error: true, message: 'Report not found' });

    // Return only necessary fields
    return res.status(200).json({ success: true, error: false, data: {
      id: doc._id,
      productName: doc.productName,
      barcode: doc.barcode,
      ai: doc.ai,
      createdAt: doc.createdAt
    }});
  } catch (e) {
    return res.status(500).json({ success: false, error: true, message: 'Internal server error' });
  }
};
  // try {
  //   const userId = req.user?.id;
  //   if (!userId) return res.status(401).json({ success: false, error: true, message: 'Unauthorized' });
  //   const id = req.params.id;

  //   const doc = Report.findOne({ _id: id, user: userId }).lean();
  //   if (!doc) return res.status(404).json({ success: false, error: true, message: 'Report not found' });

  //   // Return only necessary fields
  //   return res.status(200).json({ success: true, error: false, data: {
  //     id: doc._id,
  //     productName: doc.productName,
  //     barcode: doc.barcode,
  //     ai: doc.ai,
  //     createdAt: doc.createdAt,
  //   }});
  // } catch (e) {
  //   return res.status(500).json({ success: false, error: true, message: 'Internal server error' });
  // }



