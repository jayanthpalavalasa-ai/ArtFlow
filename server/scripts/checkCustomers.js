require('dotenv').config();

const mongoose = require('mongoose');
const Customer = require('../models/Customer');

async function checkCustomers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const customers = await Customer.find().select(
      'name email phone'
    );

    console.log(`Total customers: ${customers.length}`);

    customers.forEach((customer) => {
      console.log({
        id: customer._id.toString(),
        name: customer.name,
        email: customer.email,
        phone: customer.phone || 'NO PHONE',
      });
    });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

checkCustomers();