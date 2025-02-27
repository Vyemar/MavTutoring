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

// === Mount Other API Routes ===
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const studentScheduleRoutes = require('./routes/schedules/student');
const tutorScheduleRoutes = require('./routes/schedules/tutor');
const attendanceRoutes = require('./routes/attendance');
const availabilityRoutes = require("./routes/availability");
const feedbackRoutes = require('./routes/feedback');
const profileRoutes = require('./routes/profile');
const sessionRoutes = require('./routes/sessions');

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/schedules/student', studentScheduleRoutes);
app.use('/api/schedules/tutor', tutorScheduleRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use("/api/availability", availabilityRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/sessions', sessionRoutes);

// === SAML Configuration ===
const SAML_ENTRY_POINT = "https://login.microsoftonline.com/3d3ccb0e-386a-4644-a386-8c6e0f969126/saml2";
const SAML_ISSUER = "CSESDTutorTechApp";
const SAML_CALLBACK_URL = "https://localhost:4000/api/auth/saml/callback";
const SAML_LOGOUT_URL = "https://login.microsoftonline.com/3d3ccb0e-386a-4644-a386-8c6e0f969126/saml2";
const SAML_METADATA_URL = "https://login.microsoftonline.com/3d3ccb0e-386a-4644-a386-8c6e0f969126/federationmetadata/2007-06/federationmetadata.xml?appid=128f9b1c-b087-41ee-9fb0-58a20c1c30ce";
const SAML_CERT = `-----BEGIN CERTIFICATE-----
MIIC8DCCAdigAwIBAgIQX5Xik+PqsIVE5xiJqcWsADANBgkqhkiG9w0BAQsFADA0MTIwMAYDVQQDEylNaWNyb3NvZnQgQXp1cmUgRmVkZXJhdGVkIFNTTyBDZXJ0aWZpY2F0ZTAeFw0yNDExMTUwMzEwMDRaFw0yNzExMTUwMzEwMDNaMDQxMjAwBgNVBAMTKU1pY3Jvc29mdCBBenVyZSBGZWRlcmF0ZWQgU1NPIENlcnRpZmljYXRlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzgZggY01vs1Oo3x+qZi0MGgkHHxQNgeyzJX7OWJ/FLa1BcFwX8Q67E8YDlPd5d0muhLo5TYGmGpZWVS7YQmLAf2/Lkacr5ZbjSq9b4ub5FvPK026uHv+Abx4TKwXs/dfB78fLvK68o1nn43281sTjmTbkGCFfAXAPSdVKK6N9bsRsCbXbikVtBpMd+Ko7Ug1DW1PDCDEX/GcMEpaGoUuiz+B9GWf1e+IfRC/vyxpiylRRL7Akt8bQmBwq4RcsXEpQbkRInmABLKdeixk/MOCLrwVlwRjFF+yXyGcO5PgyYt5MjhWGvDR/G6yTk98KPEWyhjgVxEvyOrR5uE9qigopQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQBK6YHBscAckggeZjRjZwymfz2t75YT5/wJJqUMTOBWeykv1BJPE+/A5WuIXLbDnHM0Zod1guVzHj65hJRo9cjGO9zCLmaJMU2gooFWei9IclVJ4xSjhHTXxXTBUSDONdicdqku6RfDgqPEZ1MR2XXevlafudR1pdtR+8ta0IfB/s/HaqwN2I/O2ZPhwhmA+it6rVsXpugeYTQbl/1D149Iw2MNB3P+vBw9lZRFSpUCDdcIB/OtSpt70nGk7fnyviTuaevACU9Q2fz31VoK3HpaGsrp3R3QnGAeF7g8E/6zXwButdasHrd3aS7bnRK1ODmKLoD3yuCHYWaECLNRJezz
-----END CERTIFICATE-----`;

// === Middleware ===

// CORS configuration
app.use(cors({
    origin: "https://localhost:3000", // Allow frontend requests
    credentials: true,
    methods: ["GET", "POST"], // Ensure POST is allowed
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

// === SAML Strategy ===
passport.use(new SamlStrategy({
    entryPoint: SAML_ENTRY_POINT,
    issuer: SAML_ISSUER,
    callbackUrl: SAML_CALLBACK_URL,
    logoutUrl: SAML_LOGOUT_URL,
    identifierFormat: null, // Microsoft Entra ID does not require a format
    acceptedClockSkewMs: -1,
    disableRequestedAuthnContext: true, // Required for Microsoft Entra ID
    cert: SAML_CERT.replace(/\\n/g, '\n'), // Ensures correct formatting
}, (profile, done) => {
    return done(null, profile);
}));

// Serialize and Deserialize User
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// === Authentication Routes ===
app.get('/api/auth/saml', passport.authenticate('saml', { failureRedirect: '/' }));

// app.post('/api/auth/saml/callback',
//     passport.authenticate('saml', { failureRedirect: '/' }), 
//     (req, res) => {
//         console.log("SAML authentication successful, redirecting to /home...");
//         res.redirect(`https://localhost:3000/home`);
//     }
// );

app.post('/api/auth/saml/callback',
    passport.authenticate('saml', { failureRedirect: '/' }), 
    async (req, res) => {
        console.log("SAML authentication successful:", req.user);

        try {
            // Extract first name, last name, and email from SAML response
            const firstName = req.user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] || "Unknown";
            const lastName = req.user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] || "Unknown";
            const phone = req.user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone/PhoneNumber'] || "Unknown";
            const email = req.user.nameID; // Use email as unique identifier

            // Check if user exists in MongoDB
            let user = await User.findOne({ email });

            if (!user) {
                // Create new user in MongoDB if they don't exist
                user = new User({
                    firstName,
                    lastName,
                    email,
                    phone,
                    password: null, // No password for SSO users
                    role: "Student", // Default role
                    isSSO: true // Set SSO flag
                });
                await user.save();
            }

            // Store user in session
            req.session.user = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role
            };

            console.log("User session stored:", req.session.user);

            req.session.save((err) => {  // Ensure session is saved before redirecting
                if (err) {
                    console.error("Session save error:", err);
                    return res.status(500).json({ error: "Failed to save session" });
                }
                res.redirect("https://localhost:3000/home"); 
            });

        } catch (error) {
            console.error("SAML Login Error:", error);
            res.status(500).json({ message: "Error logging in with SSO", error: error.message });
        }
    }
);

app.get('/api/auth/session', (req, res) => {
    if (req.session && req.session.user) {
        return res.json({ user: req.session.user });
    } else {
        return res.status(401).json({ error: "Not authenticated" });
    }
});

app.get('/api/auth/logout', (req, res) => {
    req.logout(() => {
        req.session.destroy((err) => {
            if (err) {
                console.error("Session destruction error:", err);
                return res.status(500).json({ error: "Logout failed" });
            }

            // Clear session cookie
            res.clearCookie("connect.sid", { path: "/" });

            // Send response immediately instead of redirecting
            res.json({ message: "Logged out successfully" });
        });
    });
});


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

// Load SSL Certificate & Key
const sslOptions = {
    key: fs.readFileSync("./ssl/server.key"), // Ensure these files exist
    cert: fs.readFileSync("./ssl/server.cert")
};

// Start HTTPS Server
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server running on https://localhost:${PORT}`);
});