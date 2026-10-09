const Booking = require('../models/Booking');

async function linkGuestBookings(customer) {
  if (!customer) {
    return 0;
  }

  const email = customer.email?.toLowerCase().trim();
  const phone = customer.phone?.trim();

  const conditions = [];

  if (email) {
    conditions.push({
      customerEmail: email,
    });
  }

  if (phone) {
    conditions.push({
      customerPhone: phone,
    });
  }

  if (conditions.length === 0) {
    return 0;
  }

  const result = await Booking.updateMany(
    {
      customerId: null,
      $or: conditions,
    },
    {
      $set: {
        customerId: customer._id,
      },
    }
  );

  return result.modifiedCount;
}

module.exports = linkGuestBookings;