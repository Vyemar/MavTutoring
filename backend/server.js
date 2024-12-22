const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // For parsing cookies
const mongoose = require('mongoose'); // Import mongoose directly
require('dotenv').config(); // Load environment variables

// Import routes
const authRoutes = require('./routes/auth'); // Authentication routes
const usersRoutes = require('./routes/users'); // User management routes
const studentScheduleRoutes = require('./routes/schedules/student'); // Student schedules
const tutorScheduleRoutes = require('./routes/schedules/tutor'); // Tutor schedules
const attendanceRoutes = require('./routes/attendance'); // Attendance routesS
const availabilityRoutes = require("./routes/availability"); // Availability routes
const feedbackRoutes = require("./routes/feedback"); //feedback routes

const app = express();


// Log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware to parse incoming JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()); // Parse cookies

// CORS configuration
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));

// // Routes
// app.use('/users', usersRoute); // Mount the users route
// app.use('/', router);

// Mount routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/users', usersRoutes); // User management routes
app.use('/api/schedules/student', studentScheduleRoutes); // Student schedules
app.use('/api/schedules/tutor', tutorScheduleRoutes); // Tutor schedules
app.use('/api/attendance', attendanceRoutes); // Attendance routes
app.use("/api/availability", availabilityRoutes); // Availability routes
app.use("/api/feedback", feedbackRoutes); //Feedback routes

// Connect to MongoDB using mongoose without deprecated options
const dbUri = process.env.DB;

if (!dbUri) {
    console.error('MongoDB connection URI is undefined. Please check your .env file.');
    process.exit(1); // Exit process if DB URI is not set
}

mongoose
    .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });

// Start the server
const port = process.env.PORT || 4000; // Make sure process.env.PORT is correctly capitalized
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
