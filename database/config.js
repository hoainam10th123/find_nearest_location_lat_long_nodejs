const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log('Database is ready');
    } catch (error) {
        console.log(error)
        //throw new Error('Error connect database');
    }
}

module.exports = { dbConnection };