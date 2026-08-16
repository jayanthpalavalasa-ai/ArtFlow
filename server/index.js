require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const generateBookingId = require('./utils/generateBookingId');
const { getPrice} = require('./utils/pricing');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('ArtFlow API is running');
});

app.post('/api/bookings', async (req, res)=>{
  try{
    const {
      customerName,
      customerPhone,
      artworkType,
      size,
      numberOfPeople,
      preferredDeadline,
      imageUrl,

    } = req.body;

    if(!customerName || !customerPhone || !artworkType || !size || !imageUrl){
      return res.status(400).json({ error: 'Missing required fields' });
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
      images: [{ url: imageUrl }],
    });
    res.status(201).json(booking);
  }catch(err){
    res.status(400).json({ error: err.message });
  }
});



app.get('/api/bookings', async (req, res)=>{
  try {
    const bookings = await Booking.find().sort({createdAt : -1});
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bookings/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
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