const express = require('express');

const router = express.Router();

const {optionalAuth} = require('../middleware/customerAuth');
const upload = require('../config/multer');
const Customer = require('../models/Customer');
const Booking = require('../models/Booking');

const generateBookingId = require('../utils/generateBookingId');
const {getPrice} = require('../utils/Pricing');

router.post(
  '/',
  optionalAuth,
  upload.single('image'),
  async (req, res) => {
    try {
      const {
        customerName,
        customerEmail,
        customerPhone,
        artistNote,
        description,
        artworkType,
        size,
        numberOfPeople,
        preferredDeadline,
      } = req.body;

      if (
        !customerName ||
        !customerPhone ||
        !artworkType ||
        !size ||
        !req.file
      ) {
        return res.status(400).json({
          error: 'Missing required fields or image.',
        });
      }

      // Determine the booking email
      let bookingEmail = null;

      if (req.customerId) {
        // Logged-in customer:
        // Get the trusted email directly from MongoDB.
        const customer = await Customer.findById(req.customerId).select(
          'email'
        );

        if (!customer) {
          return res.status(401).json({
            error: 'Customer account could not be found.',
          });
        }

        bookingEmail = customer.email;
      } else {
        // Guest:
        // Use the email supplied by the commission form.
        if (!customerEmail) {
          return res.status(400).json({
            error: 'Email is required for guest bookings.',
          });
        }

        bookingEmail = customerEmail.trim().toLowerCase();
      }

      const price = getPrice(
        size,
        numberOfPeople || 1
      );

      const bookingId = await generateBookingId();

      const booking = await Booking.create({
        bookingId,

        customerId: req.customerId || null,

        customerEmail: bookingEmail,

        customerName,

        customerPhone,

        artistNote: artistNote?.trim() || '',
        description: description?.trim() || '',

        artworkType,

        size,

        numberOfPeople: numberOfPeople || 1,

        totalPrice: price,

        requiresPriceConsultation: price === null,

        preferredDeadline,

        images: [
          {
            url: req.file.secure_url,
          },
        ],
      });

      res.status(201).json(booking);
    } catch (err) {
      console.error('Booking creation error:', err);

      res.status(400).json({
        error: err.message,
      });
    }
  }
);

module.exports = router;