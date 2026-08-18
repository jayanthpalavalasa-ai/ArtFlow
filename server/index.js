require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const generateBookingId = require('./utils/generateBookingId');
const { getPrice } = require('./utils/Pricing');
const upload = require('./config/multer');
const jwt = require('jsonwebtoken');
const Artist = require('./models/Artist');
const requireAuth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('ArtFlow API is running');
});

app.post('/api/auth/login', async(req, res)=>{
  try{
    const {email,password}= req.body;

    if(!email || !password){
      return res.status(400).json({error: 'Email and password are required'});
    }

    const artist = await Artist.findOne({email});
    if(!artist){
      return res.status(401).json({error: 'Invalid email or password'});
    } 
    const isMatch = await artist.comparePassword(password);
    if(!isMatch){
      return res.status(401).json({error: 'Invalid email or password'});
    }
    const token = jwt.sign(
      {
        artistId: artist._id
      },
      process.env.JWT_SECRET,
      {expiresIn: '7d'}
    );


    res.json({
      token,
      artist: { id: artist._id, name: artist.name, email: artist.email }
    });

  } catch(err){
    res.status(500).json({error: err.message});
  }
});

app.post('/api/bookings', upload.single('image'), async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      artworkType,
      size,
      numberOfPeople,
      preferredDeadline,
    } = req.body;

  
    if (!customerName || !customerPhone || !artworkType || !size || !req.file) {
      return res.status(400).json({ error: 'Missing required fields or image.' });
    }

    const price = getPrice(size, numberOfPeople || 1);
    const bookingId = await generateBookingId();

    const booking = await Booking.create({
      bookingId,
      customerName,
      customerPhone,
      artworkType,
      size,
      numberOfPeople: numberOfPeople || 1,
      totalPrice: price,
      requiresPriceConsultation: price === null,
      preferredDeadline,
      images: [{ url: req.file.secure_url }],
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/bookings',requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bookings/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/bookings/:bookingId/accept-image', requireAuth, async (req, res) => {
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

app.patch('/api/bookings/:bookingId/reject-image', requireAuth, async (req, res) => {
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
app.patch(
  '/api/bookings/:bookingId/upload-replacement',
  upload.single('image'),
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

app.patch(
  '/api/bookings/:bookingId/deposit-payment',
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

      if (booking.status !== 'accepted') {
        return res.status(400).json({
          error: 'Deposit payment can only be submitted after the image is accepted.',
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
app.patch(
  '/api/bookings/:bookingId/confirm-deposit',
  requireAuth,
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
app.patch(
  '/api/bookings/:bookingId/complete',
  requireAuth,
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
app.patch(
  '/api/bookings/:bookingId/final-payment',
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

      if (booking.status !== 'completed') {
        return res.status(400).json({
          error: 'Final payment can only be submitted after the artwork is completed.',
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
app.patch(
  '/api/bookings/:bookingId/confirm-final-payment',
  requireAuth,
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
          error: 'Final payment can only be confirmed after the artwork is completed.',
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
app.patch(
  '/api/bookings/:bookingId/deliver',
  requireAuth,
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


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });