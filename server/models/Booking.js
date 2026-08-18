const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  reviewStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  reviewNote:{
    type: String,
  }
});

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    artworkType: {
      type: String,
      enum: ['pencil', 'blood'],
      required: true,
    },
    size: {
      type: String,
      enum: ['A4', 'A3', 'A2'],
      required: true,
    },
    numberOfPeople: {
      type: Number,
      default: 1,
      validate: {
        validator: function (value) {
          if (this.size === 'A4') return value === 1;
          return value >= 1 && value <= 3;
        },
        message: 'Invalid number of people for the selected size.',
      },
    },
    totalPrice: { type: Number }, // null for A2, resolved via pricing lookup for A3/A4
    requiresPriceConsultation: { type: Boolean, default: false },
    preferredDeadline: { type: Date },
    images: [imageSchema],
    status: {
      type: String,
      enum: [
        'pending_review',
        'rejected',
        'accepted',
        'in_progress',
        'completed',
        'shipped',
        'delivered',
        'cancelled',
      ],
      default: 'pending_review',
    },
    completedArtworkUrl: {
  type: String,
},
    payment: {
      depositAmount: { type: Number },
      depositPaid: { type: Boolean, default: false },
      depositScreenshotUrl: { type: String },
      depositConfirmedAt: { type: Date },
      finalAmount: { type: Number },
      finalPaid: { type: Boolean, default: false },
      finalScreenshotUrl: { type: String },
      finalConfirmedAt: { type: Date },
    },
    deliveryAddress: {
      addressLine: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);