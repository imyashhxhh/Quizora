// User Schema define kiya for DB : 
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: { // Changed from 'name'
      type: String,
      required: true,
      trim: true,
    },
    lastName: { // Added this field
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
     type: String 
    }, // To store the generated OTP
    otpExpires: { 
      type: Date 
    }, // To store the OTP expiry time
    isVerified: { 
      type: Boolean, default: false 
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;