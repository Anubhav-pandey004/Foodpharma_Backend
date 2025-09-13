const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const allowedAllergens = [
  'nuts', 'peanuts', 'tree-nuts', 'dairy', 'gluten', 'eggs', 'soy', 'shellfish', 'fish', 'sesame', 'wheat'
];
const allowedDietPatterns = ['veg', 'non-veg'];
const allowedDietRestrictions = ['low-sodium', 'keto'];

const healthProfileSchema = new mongoose.Schema({
  conditions: {
    diabetes: { type: Boolean, default: false },
    hypertension: { type: Boolean, default: false },
    chronicKidneyDisease: { type: Boolean, default: false },
    heartDisease: { type: Boolean, default: false },
    pku: { type: Boolean, default: false },
    ibs: { type: Boolean, default: false },
    gout: { type: Boolean, default: false },
  },
  lactoseIntolerance: { type: Boolean, default: false },
  allergies: [{ type: String, enum: allowedAllergens }],
  dietPattern: { type: String, enum: allowedDietPatterns },
  dietRestrictions: [{ type: String, enum: allowedDietRestrictions }],
}, { _id: false });

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    healthProfile: { type: healthProfileSchema, default: () => ({}) },
    healthProfileComplete: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model("User",userSchema)
