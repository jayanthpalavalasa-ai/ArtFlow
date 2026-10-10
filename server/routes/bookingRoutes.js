const express = require('express');

const router = express.Router();

const { optionalAuth, requireCustomerAuth } = require('../middleware/customerAuth');
const requireAuth = require('../middleware/auth');
const requireApprovedArtist = require('../middleware/requireApprovedArtist');

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
      const normalizedPhone = customerPhone.trim();

if (!/^[6-9][0-9]{9}$/.test(normalizedPhone)) {
  return res.status(400).json({
    error: 'Phone number must be exactly 10 digits.',
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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(bookingEmail)) {
  return res.status(400).json({
    error: 'Please enter a valid email address.',
  });
}
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

        customerPhone: normalizedPhone,

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
router.get('/', requireAuth,
requireApprovedArtist, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.get(
  '/artist/:bookingId',
  requireAuth,
requireApprovedArtist,
  async (req, res) => {
    try {
      const booking = await Booking.findOne({
        bookingId: req.params.bookingId,
      });

      if (!booking) {
        return res.status(404).json({
          error: 'Booking not found.',
        });
      }

      res.json(booking);
    } catch (err) {
      console.error('Artist booking details error:', err);

      res.status(500).json({
        error: 'Failed to retrieve booking details.',
      });
    }
  }
);


router.get(
  '/:bookingId',
  optionalAuth,
  async (req, res) => {
    try {
      const booking = await Booking.findOne({
        bookingId: req.params.bookingId,
      });

      if (!booking) {
        return res.status(404).json({
          error: 'Booking not found.',
        });
      }

      // Guest booking
      // Anyone can track it.
      if (!booking.customerId) {
        return res.json({
          bookingId: booking.bookingId,
          customerName: booking.customerName,
          artworkType: booking.artworkType,
          size: booking.size,
          numberOfPeople: booking.numberOfPeople,
          totalPrice: booking.totalPrice,
          requiresPriceConsultation: booking.requiresPriceConsultation,
          preferredDeadline: booking.preferredDeadline,
          status: booking.status,
        });
      }

      // Account booking
      // Must be logged in.
      if (!req.customerId) {
        return res.status(401).json({
          error: 'Please sign in to track this booking.',
        });
      }

      // Account booking belongs to another customer.
      if (
        booking.customerId.toString() !==
        req.customerId.toString()
      ) {
        return res.status(403).json({
          error: 'You do not have access to this booking.',
        });
      }

      // Owner of the booking.
      res.json({
        bookingId: booking.bookingId,
        customerName: booking.customerName,
        artworkType: booking.artworkType,
        size: booking.size,
        numberOfPeople: booking.numberOfPeople,
        totalPrice: booking.totalPrice,
        requiresPriceConsultation: booking.requiresPriceConsultation,
        preferredDeadline: booking.preferredDeadline,
        status: booking.status,
      });

    } catch (err) {
      console.error('Track booking error:', err);

      res.status(500).json({
        error: 'Failed to retrieve booking.',
      });
    }
  }
);


router.patch('/:bookingId/accept-image', requireAuth,
requireApprovedArtist, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingId: req.params.bookingId,
    });

    if (!booking) {
      return res.status(404).json({
        error: 'Booking not found.',
      });
    }

    const image = booking.images[booking.images.length - 1];

    if (!image) {
      return res.status(400).json({
        error: 'No image found for this booking.',
      });
    }

    if (image.reviewStatus !== 'pending') {
      return res.status(400).json({
        error: 'This image has already been reviewed.',
      });
    }

    image.reviewStatus = 'accepted';
    booking.status = 'accepted';

    await booking.save();

    res.json({
      message: 'Image accepted.',
      booking,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.patch('/:bookingId/reject-image', requireAuth, requireApprovedArtist, async (req, res) => {
  try {
    const { reviewNote } = req.body;

    if (!reviewNote) {
      return res.status(400).json({
        error: 'A rejection reason is required.',
      });
    }

    const booking = await Booking.findOne({
      bookingId: req.params.bookingId,
    });

    if (!booking) {
      return res.status(404).json({
        error: 'Booking not found.',
      });
    }

    const image = booking.images[booking.images.length - 1];

    if (!image) {
      return res.status(400).json({
        error: 'No image found for this booking.',
      });
    }

    if (image.reviewStatus !== 'pending') {
      return res.status(400).json({
        error: 'This image has already been reviewed.',
      });
    }

    image.reviewStatus = 'rejected';
    image.reviewNote = reviewNote;

    booking.status = 'rejected';

    await booking.save();

    res.json({
      message: 'Image rejected.',
      booking,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.patch('/:bookingId/upload-replacement', requireCustomerAuth,
  upload.single('image'),
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

      if (booking.status !== 'rejected') {
        return res.status(400).json({
          error: 'A replacement image can only be uploaded after rejection.',
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: 'Replacement image is required.',
        });
      }

      booking.images.push({
        url: req.file.secure_url,
        reviewStatus: 'pending',
      });

      booking.status = 'pending_review';

      await booking.save();

      res.status(201).json({
        message: 'Replacement image uploaded successfully.',
        booking,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);


router.patch('/:bookingId/deposit-payment',
  requireCustomerAuth,
  upload.single('paymentScreenshot'),
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

      if (booking.status !== 'accepted') {
        return res.status(400).json({
          error:
            'Deposit payment can only be submitted after the image is accepted.',
        });
      }

      if (booking.payment.depositPaid) {
        return res.status(400).json({
          error: 'Deposit has already been confirmed.',
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: 'Payment screenshot is required.',
        });
      }

      const depositAmount = booking.totalPrice / 2;

     booking.payment.depositAmount = depositAmount;
      booking.payment.depositScreenshotUrl = req.file.secure_url;
      booking.payment.depositSubmittedAt = new Date();

      await booking.save();

      res.status(201).json({
        message: 'Deposit payment screenshot submitted successfully.',
        booking,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

router.patch('/:bookingId/confirm-deposit',
  requireAuth,
requireApprovedArtist,
  async (req, res) => {
    try {
      const booking = await Booking.findOne({
        bookingId: req.params.bookingId,
      });

      if (!booking) {
        return res.status(404).json({
          error: 'Booking not found.',
        });
      }

      if (booking.status !== 'accepted') {
        return res.status(400).json({
          error: 'Deposit can only be confirmed for an accepted booking.',
        });
      }

      if (!booking.payment.depositScreenshotUrl) {
        return res.status(400).json({
          error: 'No deposit payment screenshot has been submitted.',
        });
      }

      if (booking.payment.depositPaid) {
        return res.status(400).json({
          error: 'Deposit has already been confirmed.',
        });
      }

      booking.payment.depositPaid = true;
      booking.payment.depositConfirmedAt = new Date();
      booking.status = 'in_progress';

      await booking.save();

      res.json({
        message: 'Deposit confirmed. Artwork can now begin.',
        booking,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

router.patch('/:bookingId/complete',
  requireAuth,
requireApprovedArtist,
  upload.single('completedArtwork'),
  async (req, res) => {
    try {
      const booking = await Booking.findOne({
        bookingId: req.params.bookingId,
      });

      if (!booking) {
        return res.status(404).json({
          error: 'Booking not found.',
        });
      }

      if (booking.status !== 'in_progress') {
        return res.status(400).json({
          error: 'Only an in-progress booking can be marked as completed.',
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: 'A photo of the completed artwork is required.',
        });
      }

      booking.completedArtworkUrl = req.file.secure_url;
      booking.status = 'completed';

      await booking.save();

      res.json({
        message: 'Artwork marked as completed.',
        booking,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);
router.patch(
  '/:bookingId/final-payment',
  requireCustomerAuth,
  upload.single('paymentScreenshot'),
  async (req, res) => {
    try {
      const booking = await Booking.findOne({
        bookingId: req.params.bookingId,
      });

      if (!booking) {
        return res.status(404).json({
          error: 'Booking not found.',
        });
      }

      // Ensure the booking belongs to the logged-in customer.
      if (
        !booking.customerId ||
        booking.customerId.toString() !== req.customerId.toString()
      ) {
        return res.status(403).json({
          error: 'You are not authorized to submit payment for this booking.',
        });
      }

      if (booking.status !== 'completed') {
        return res.status(400).json({
          error:
            'Final payment can only be submitted after the artwork is completed.',
        });
      }

      if (booking.payment.finalPaid) {
        return res.status(400).json({
          error: 'Final payment has already been confirmed.',
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: 'Final payment screenshot is required.',
        });
      }

      const finalAmount =
        booking.totalPrice - booking.payment.depositAmount;

      booking.payment.finalAmount = finalAmount;
      booking.payment.finalScreenshotUrl = req.file.secure_url;

      // Record when the customer submitted the final payment screenshot.
      booking.payment.finalSubmittedAt = new Date();

      await booking.save();

      res.status(201).json({
        message: 'Final payment screenshot submitted successfully.',
        booking,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

router.patch(
  '/:bookingId/confirm-final-payment',
  requireAuth,
requireApprovedArtist,
  async (req, res) => {
    try {
      const booking = await Booking.findOne({
        bookingId: req.params.bookingId,
      });

      if (!booking) {
        return res.status(404).json({
          error: 'Booking not found.',
        });
      }

      if (booking.status !== 'completed') {
        return res.status(400).json({
          error:
            'Final payment can only be confirmed after the artwork is completed.',
        });
      }

      if (!booking.payment.finalScreenshotUrl) {
        return res.status(400).json({
          error: 'No final payment screenshot has been submitted.',
        });
      }

      if (booking.payment.finalPaid) {
        return res.status(400).json({
          error: 'Final payment has already been confirmed.',
        });
      }

      booking.payment.finalPaid = true;
      booking.payment.finalConfirmedAt = new Date();
      booking.status = 'shipped';

      await booking.save();

      res.json({
        message: 'Final payment confirmed. Booking is ready for shipping.',
        booking,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

router.patch(
  '/:bookingId/deliver',
  requireAuth,
  requireApprovedArtist,
  async (req, res) => {
    try {
      const booking = await Booking.findOne({
        bookingId: req.params.bookingId,
      });

      if (!booking) {
        return res.status(404).json({
          error: 'Booking not found.',
        });
      }

      if (booking.status !== 'shipped') {
        return res.status(400).json({
          error: 'Only a shipped booking can be marked as delivered.',
        });
      }

      booking.status = 'delivered';

      await booking.save();

      res.json({
        message: 'Booking marked as delivered.',
        booking,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);


module.exports = router;

