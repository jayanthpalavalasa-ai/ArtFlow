const express = require('express');

const { requireCustomerAuth } = require('../middleware/customerAuth');
const Customer = require('../models/Customer');
const Booking = require('../models/Booking');
const linkGuestBookings = require('../utils/linkGuestBookings');


const router = express.Router();

router.get('/me', requireCustomerAuth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.customerId).select(
      '-password'
    );

    if (!customer) {
      return res.status(404).json({
        error: 'Customer not found.',
      });
    }

   res.json({
  customer: {
    id: customer._id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
  },
});
  } catch (err) {
    console.error('Get current customer error:', err);

    res.status(500).json({
      error: 'Failed to fetch customer.',
    });
  }
});

router.get('/me/bookings', requireCustomerAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({
      customerId: req.customerId,
    }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error('Get customer bookings error:', err);

    res.status(500).json({
      error: 'Failed to fetch bookings.',
    });
  }
});

router.get('/me/bookings/:bookingId',
  requireCustomerAuth,
  async (req, res) => {
    try {
      const booking = await Booking.findOne({
        bookingId: req.params.bookingId,
        customerId: req.customerId,
      });

      if (!booking) {
        return res.status(404).json({
          error: 'Booking not found.',
        });
      }

      res.json(booking);
    } catch (err) {
      console.error('Get customer booking details error:', err);

      res.status(500).json({
        error: 'Failed to fetch booking details.',
      });
    }
  }
);

router.post('/me/claim-booking', requireCustomerAuth, async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        error: 'Booking ID is required.',
      });
    }

    // Get the logged-in customer's trusted email
    const customer = await Customer.findById(req.customerId).select(
      'email'
    );

    if (!customer) {
      return res.status(401).json({
        error: 'Customer account could not be found.',
      });
    }

    // Find a guest booking only
    const booking = await Booking.findOne({
      bookingId: bookingId.trim(),
      customerId: null,
    });

    // Don't reveal whether a booking exists if the email doesn't match
    if (
      !booking ||
      !booking.customerEmail ||
      booking.customerEmail.toLowerCase() !==
        customer.email.toLowerCase()
    ) {
      return res.status(404).json({
        error:
          'We could not add that booking to your account. Please check the booking ID.',
      });
    }

    // Claim the booking
    booking.customerId = req.customerId;

    await booking.save();

    res.json({
      message: 'Booking added to your account successfully.',
      booking,
    });
  } catch (err) {
    console.error('Claim booking error:', err);

    res.status(500).json({
      error: 'Failed to add booking to your account.',
    });
  }
});

router.patch('/me', requireCustomerAuth, async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        error: 'Phone number is required.',
      });
    }

    const normalizedPhone = phone.trim();

    if (!/^[6-9][0-9]{9}$/.test(normalizedPhone)) {
      return res.status(400).json({
        error: 'Phone number must be exactly 10 digits.',
      });
    }

    const customer = await Customer.findById(req.customerId);

    if (!customer) {
      return res.status(404).json({
        error: 'Customer not found.',
      });
    }

    customer.phone = normalizedPhone;

    await customer.save();

    // Automatically attach matching old guest bookings
    await linkGuestBookings(customer);

    res.json({
      message: 'Phone number updated successfully.',
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (err) {
    console.error('Update customer phone error:', err);

    res.status(500).json({
      error: 'Failed to update phone number.',
    });
  }
});

module.exports = router;