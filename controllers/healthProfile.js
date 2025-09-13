const User = require('../models/userModel');

const ALLOWED_ALLERGENS = new Set(['nuts','peanuts','tree-nuts','dairy','gluten','eggs','soy','shellfish','fish','sesame','wheat']);
const ALLOWED_DIET_PATTERNS = new Set(['veg','non-veg']);
const ALLOWED_RESTRICTIONS = new Set(['low-sodium','keto']);

function toBool(v) { return !!v; }
function sanitizeArray(arr, allowedSet, maxLen = 20) {
  if (!Array.isArray(arr)) return [];
  const out = [];
  for (const raw of arr) {
    if (typeof raw !== 'string') continue;
    const v = raw.trim().toLowerCase();
    if (allowedSet.has(v) && !out.includes(v)) out.push(v);
    if (out.length >= maxLen) break;
  }
  return out;
}

exports.getHealthProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, error: true, message: 'Unauthorized' });

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ success: false, error: true, message: 'User not found' });

    return res.status(200).json({ success: true, error: false, data: {
      healthProfile: user.healthProfile || {},
      healthProfileComplete: !!user.healthProfileComplete,
    }});
  } catch (e) {
    return res.status(500).json({ success: false, error: true, message: 'Internal server error' });
  }
};

exports.updateHealthProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, error: true, message: 'Unauthorized' });

    const body = req.body || {};

    // Conditions
    const cond = body.conditions || {};
    const conditions = {
      diabetes: toBool(cond.diabetes),
      hypertension: toBool(cond.hypertension),
      chronicKidneyDisease: toBool(cond.chronicKidneyDisease),
      heartDisease: toBool(cond.heartDisease),
      pku: toBool(cond.pku),
      ibs: toBool(cond.ibs),
      gout: toBool(cond.gout),
    };

    const lactoseIntolerance = toBool(body.lactoseIntolerance);

    // Allergies, diet
    const allergies = sanitizeArray(body.allergies, ALLOWED_ALLERGENS, 20);
    const dietPatternRaw = typeof body.dietPattern === 'string' ? body.dietPattern.trim().toLowerCase() : '';
    const dietPattern = ALLOWED_DIET_PATTERNS.has(dietPatternRaw) ? dietPatternRaw : undefined;
    const dietRestrictions = sanitizeArray(body.dietRestrictions, ALLOWED_RESTRICTIONS, 10);

    const healthProfile = { conditions, lactoseIntolerance, allergies, dietPattern, dietRestrictions };
    const complete = !!dietPattern; // consider complete when dietPattern is set; extend as needed

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: { healthProfile, healthProfileComplete: complete } },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return res.status(404).json({ success: false, error: true, message: 'User not found' });

    return res.status(200).json({ success: true, error: false, message: 'Health profile updated', data: {
      healthProfile: updated.healthProfile,
      healthProfileComplete: !!updated.healthProfileComplete,
    }});
  } catch (e) {
    return res.status(500).json({ success: false, error: true, message: 'Internal server error' });
  }
};
