const express = require('express');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const app = express();

// === Load Environment Variables ===
const MONGO_URI = process.env.DB;
const PORT = process.env.PORT || 4000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'default_secret';

// === Load Models ===
const User = require('./models/User');

// === Middleware ===

// CORS configuration
app.use(cors({
    origin: "https://localhost:3000", // Allow frontend requests
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow common HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware for parsing JSON, URL-encoded data, and cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// === Session Setup ===
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true in production
        sameSite: "lax"
    }
}));

// === Passport.js Setup ===
app.use(passport.initialize());
app.use(passport.session());

// Import auth module (contains both routes and SAML config)
const auth = require('./routes/auth');

// === SAML Strategy ===
passport.use(new SamlStrategy(auth.samlConfig, (profile, done) => {
    return done(null, profile);
}));

// Serialize and Deserialize User
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// === Mount API Routes ===
app.use('/api/auth', auth.router); // Use the router exported from auth.js

// Load other routes
const usersRoutes = require('./routes/users');
const studentScheduleRoutes = require('./routes/schedules/student');
const tutorScheduleRoutes = require('./routes/schedules/tutor');
const attendanceRoutes = require('./routes/attendance');
const availabilityRoutes = require("./routes/availability");
const feedbackRoutes = require('./routes/feedback');
const profileRoutes = require('./routes/profile');
const sessionRoutes = require('./routes/sessions');

// Mount other routes
app.use('/api/users', usersRoutes);
app.use('/api/schedules/student', studentScheduleRoutes);
app.use('/api/schedules/tutor', tutorScheduleRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use("/api/availability", availabilityRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/sessions', sessionRoutes);

// === Connect to MongoDB ===
if (!MONGO_URI) {
    console.error('MongoDB connection URI is undefined. Please check your .env file.');
    process.exit(1);
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err.message));

// === Start the Server ===
const https = require('https');
const fs = require('fs');

const sslFolderPath = "./ssl";
const keyPath = `${sslFolderPath}/server.key`;
const certPath = `${sslFolderPath}/server.cert`;

// Load SSL Certificate & Key
const sslOptions = {
    key: fs.readFileSync("./ssl/server.key"), 
    cert: fs.readFileSync("./ssl/server.cert")
};

// Start HTTPS Server
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server running on https://localhost:${PORT}`);
});