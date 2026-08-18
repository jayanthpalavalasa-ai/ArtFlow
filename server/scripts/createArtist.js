require('dotenv').config();
const mongoose = require('mongoose');
const Artist = require('../models/Artist');

async function createArtist() {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await Artist.findOne({
        email: 'eswartallapudi@gmail.com'
    });
    if(existing){
        console.log('Artist already exists');
        process.exit();
    }
    const artist = await Artist.create({
        name: 'Eswar Tallapudi',
        email: 'eswartallapudi@gmail.com',
        password: 'eswar99112', 

    });
    console.log('Artist created:', artist.email);
    process.exit();

}
createArtist();