const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require('resend');

const Artist = require('../models/Artist');
const Customer = require('../models/Customer');
const requireAuth = require('../middleware/auth');
const linkGuestBookings = require('../utils/linkGuestBookings');

const resend = new Resend(process.env.RESEND_API_KEY);
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    const artist = await Artist.findOne({ email });

    if (!artist) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    const isMatch = await artist.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      {
        artistId: artist._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({
      token,
      artist: {
        id: artist._id,
        name: artist.name,
        email: artist.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.get('/artist/me', requireAuth, async (req, res) => {
  try {
    const artist = await Artist.findById(req.artistId)
      .select('_id name email');

    if (!artist) {
      return res.status(404).json({
        error: 'Artist not found.',
      });
    }

    res.json({
      artist: {
        id: artist._id,
        name: artist.name,
        email: artist.email,
      },
    });
  } catch (err) {
    console.error('Fetch current artist error:', err);

    res.status(500).json({
      error: 'Failed to fetch artist.',
    });
  }
});

router.post('/customer/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const normalizedEmail = email?.toLowerCase().trim();

    const normalizedPhone = phone.trim();

if (!/^[6-9][0-9]{9}$/.test(normalizedPhone)) {
  return res.status(400).json({
    error: 'Phone number must be exactly 10 digits.',
  });
}

    // Validate input
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        error: 'Name, email and password are required',
      });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({
      email: normalizedEmail,
    });

    if (existingCustomer) {
      return res.status(409).json({
        error: 'An account with this email already exists',
      });
    }

   const customer = await Customer.create({
  name,
  email: normalizedEmail,
  phone: normalizedPhone,
  password,
});

    await linkGuestBookings(customer);

    // Create customer JWT
    const token = jwt.sign(
      {
        customerId: customer._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    // Return token + customer info
    res.status(201).json({
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
      },
    });
  } catch (err) {
    console.error('Customer signup error:', err);

    res.status(500).json({
      error: err.message,
    });
  }
});

router.post('/customer/forgot-password', async (req, res) => {
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

router.post('/customer/reset-password', async (req, res) => {
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

router.post('/customer/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    const customer = await Customer.findOne({
      email: email.toLowerCase().trim(),
    });

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
    await linkGuestBookings(customer);

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

module.exports = router;