const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/auth');
const mongoose = require('mongoose'); // Import mongoose directly
require('dotenv').config(); // Load environment variables

const app = express();

// Log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware to parse incoming JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS configuration
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));

// Routes
app.use('/', router);

// Connect to MongoDB using mongoose without deprecated options
const dbUri = process.env.DB;

if (!dbUri) {
    console.error('MongoDB connection URI is undefined. Please check your .env file.');
    process.exit(1); // Exit process if DB URI is not set
}

mongoose.connect(dbUri)
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err.message);
    });

// Start the server
const port = process.env.PORT || 4000; // Make sure process.env.PORT is correctly capitalized
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
