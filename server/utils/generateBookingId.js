const Counter = require('../models/Counter');

async function generateBookingId() {
  const counter = await Counter.findOneAndUpdate(
    { name: 'bookingId' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  const year = new Date().getFullYear();
  const padded = String(counter.value).padStart(4, '0');
  return `AF-${year}-${padded}`;
}

module.exports = generateBookingId;