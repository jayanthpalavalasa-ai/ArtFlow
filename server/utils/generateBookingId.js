const Counter = require('../models/Counter');

async function generateBookingId() {
  const year = new Date().getFullYear();

  const counter = await Counter.findOneAndUpdate(
    { name: `bookingId-${year}` },
    { $inc: { value: 1 } },
    {
      returnDocument: 'after',
      upsert: true,
    }
  );

  const padded = String(counter.value).padStart(4, '0');

  return `AF-${year}-${padded}`;
}

module.exports = generateBookingId;