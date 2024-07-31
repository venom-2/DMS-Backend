const mongoose = require('mongoose');
require('dotenv').config();


const connectToDB = async () => {
    try {

        // Connect to MongoDB
        await mongoose.connect(process.env.DB_URI);
        console.log('Connected to MongoDB');

    } catch (error) {

        // Error connecting to MongoDB
        console.error('Error connecting to MongoDB', error);

    }
}

module.exports = connectToDB;