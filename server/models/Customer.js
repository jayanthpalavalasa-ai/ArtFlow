const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Password reset fields
    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


// Hash password before saving
customerSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 10);
});


// Compare entered password with hashed password
customerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


// Generate a secure password reset token
customerSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Store only the hashed token in MongoDB
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Token valid for 15 minutes
  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

  // Return the raw token so it can be sent by email
  return resetToken;
};


module.exports = mongoose.model('Customer', customerSchema);