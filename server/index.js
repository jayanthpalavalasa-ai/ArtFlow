require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require('resend');

const Booking = require('./models/Booking');
const Artist = require('./models/Artist');
const Customer = require('./models/Customer');

const generateBookingId = require('./utils/generateBookingId');
const { getPrice } = require('./utils/Pricing');

const upload = require('./config/multer');

const requireAuth = require('./middleware/auth');

const {
  optionalAuth,
  requireCustomerAuth,
} = require('./middleware/customerAuth');

const resend = new Resend(process.env.RESEND_API_KEY);

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

// adding customer auth;
app.post('/api/auth/customer/signup', async (req, res) => {
  try {
   const { name, email, password } = req.body;

const normalizedEmail = email?.toLowerCase().trim();

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email and password are required'
      });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({
  email: normalizedEmail,
});

    if (existingCustomer) {
      return res.status(409).json({
        error: 'An account with this email already exists'
      });
    }



  const customer = await Customer.create({
  name,
  email: normalizedEmail,
  password
});

    // Create customer JWT
    const token = jwt.sign(
      {
        customerId: customer._id
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return token + customer info
    res.status(201).json({
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email
      }
    });

  } catch (err) {
    console.error('Customer signup error:', err);

    res.status(500).json({
      error: err.message
    });
  }
});

//customer auth ends.
// adding route to customer login.
app.post('/api/auth/customer/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    const isMatch = await customer.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      {
        customerId: customer._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
      },
    });

  } catch (err) {
    console.error('Customer login error:', err);

    res.status(500).json({
      error: err.message,
    });
  }
});
// customer login end.


app.post(
  '/api/bookings',
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

      console.log(
        'BOOKING CUSTOMER ID:',
        req.customerId || 'guest'
      );

      console.log(
        'BOOKING EMAIL:',
        bookingEmail
      );

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


app.get('/api/bookings',requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get(
  '/api/bookings/:bookingId',
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
app.get(
  '/api/customers/me',
  requireCustomerAuth,
  async (req, res) => {
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
        },
      });
    } catch (err) {
      console.error('Get current customer error:', err);

      res.status(500).json({
        error: 'Failed to fetch customer.',
      });
    }
  }
);
app.get(
  '/api/customers/me/bookings',
  requireCustomerAuth,
  async (req, res) => {
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
  }
);
app.post(
  '/api/customers/me/claim-booking',
  requireCustomerAuth,
  async (req, res) => {
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
  }
);


app.post('/api/auth/customer/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
      });
    }

    const customer = await Customer.findOne({
      email: email.toLowerCase().trim(),
    });

    // Don't reveal whether the account exists
    if (!customer) {
      return res.json({
        message:
          'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Generate secure reset token
    const resetToken = customer.createPasswordResetToken();

    await customer.save();

    // Development frontend URL
    const resetUrl =
      `http://localhost:5173/reset-password/${resetToken}`;

    const { data, error } = await resend.emails.send({
      from: "Eswar Tallapudi's Art <onboarding@resend.dev>",
      to: [customer.email],
      subject: "Reset your Eswar Tallapudi's Art password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
          
          <h2>Password Reset</h2>

          <p>Hello ${customer.name},</p>

          <p>
            We received a request to reset the password for your
            Eswar Tallapudi's Art account.
          </p>

          <p>
            Click the button below to create a new password:
          </p>

          <p>
            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                padding: 12px 22px;
                background: #111;
                color: #fff;
                text-decoration: none;
                border-radius: 6px;
              "
            >
              Reset Password
            </a>
          </p>

          <p>
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <p>
            If you didn't request a password reset, you can safely ignore
            this email.
          </p>

          <p>
            — Eswar Tallapudi's Art
          </p>

        </div>
      `,
    });
if (error) {
  console.error('Resend error:', error);

  return res.status(500).json({
    error: 'Failed to send password reset email.',
  });
}
    console.log('Password reset email sent:', data.id);

    res.json({
      message:
        'If an account with that email exists, a password reset link has been sent.',
    });

  } catch (err) {
    console.error('Forgot password error:', err);

    res.status(500).json({
      error: 'Something went wrong. Please try again later.',
    });
  }
});



app.post('/api/auth/customer/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        error: 'Reset token and new password are required.',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long.',
      });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const customer = await Customer.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!customer) {
      return res.status(400).json({
        error: 'Reset token is invalid or expired.',
      });
    }

    customer.password = newPassword;

    // Invalidate the reset token immediately
    customer.resetPasswordToken = null;
    customer.resetPasswordExpires = null;

    await customer.save();

    res.json({
      message: 'Password has been reset successfully.',
    });

  } catch (err) {
    console.error('Reset password error:', err);

    res.status(500).json({
      error: 'Something went wrong. Please try again later.',
    });
  }
});



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