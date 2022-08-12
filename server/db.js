const mongoose = require('mongoose');
const DB_URI = process.env.DB_URI;

const connectDB = () => {
    if (!DB_URI) {
        console.error('[error]: The "DB_URI" environment variable is required');
        process.exit(1);
    }

    const MONGO_URL = DB_URI;
    try {
        mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
