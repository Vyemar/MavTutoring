const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Get configuration from environment variables
const PROTOCOL = process.env.PROTOCOL || 'https';
const BACKEND_HOST = process.env.BACKEND_HOST || 'localhost';
const BACKEND_PORT = process.env.BACKEND_PORT || '4000';
const FRONTEND_HOST = process.env.FRONTEND_HOST || 'localhost';
const FRONTEND_PORT = process.env.FRONTEND_PORT || '3000';

// Construct URLs dynamically
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;
const FRONTEND_URL = `${PROTOCOL}://${FRONTEND_HOST}:${FRONTEND_PORT}`;

// === SAML Configuration ===
const SAML_ENTRY_POINT = "https://login.microsoftonline.com/3d3ccb0e-386a-4644-a386-8c6e0f969126/saml2"; // TUTOR TECH TENANT
const SAML_ISSUER = "CSESDTutorTechApp";
const SAML_CALLBACK_URL = `${BACKEND_URL}/api/auth/saml/callback`;
const SAML_LOGOUT_URL = "https://login.microsoftonline.com/3d3ccb0e-386a-4644-a386-8c6e0f969126/saml2";
const SAML_CERT = `-----BEGIN CERTIFICATE-----
MIIC8DCCAdigAwIBAgIQX5Xik+PqsIVE5xiJqcWsADANBgkqhkiG9w0BAQsFADA0MTIwMAYDVQQDEylNaWNyb3NvZnQgQXp1cmUgRmVkZXJhdGVkIFNTTyBDZXJ0aWZpY2F0ZTAeFw0yNDExMTUwMzEwMDRaFw0yNzExMTUwMzEwMDNaMDQxMjAwBgNVBAMTKU1pY3Jvc29mdCBBenVyZSBGZWRlcmF0ZWQgU1NPIENlcnRpZmljYXRlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzgZggY01vs1Oo3x+qZi0MGgkHHxQNgeyzJX7OWJ/FLa1BcFwX8Q67E8YDlPd5d0muhLo5TYGmGpZWVS7YQmLAf2/Lkacr5ZbjSq9b4ub5FvPK026uHv+Abx4TKwXs/dfB78fLvK68o1nn43281sTjmTbkGCFfAXAPSdVKK6N9bsRsCbXbikVtBpMd+Ko7Ug1DW1PDCDEX/GcMEpaGoUuiz+B9GWf1e+IfRC/vyxpiylRRL7Akt8bQmBwq4RcsXEpQbkRInmABLKdeixk/MOCLrwVlwRjFF+yXyGcO5PgyYt5MjhWGvDR/G6yTk98KPEWyhjgVxEvyOrR5uE9qigopQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQBK6YHBscAckggeZjRjZwymfz2t75YT5/wJJqUMTOBWeykv1BJPE+/A5WuIXLbDnHM0Zod1guVzHj65hJRo9cjGO9zCLmaJMU2gooFWei9IclVJ4xSjhHTXxXTBUSDONdicdqku6RfDgqPEZ1MR2XXevlafudR1pdtR+8ta0IfB/s/HaqwN2I/O2ZPhwhmA+it6rVsXpugeYTQbl/1D149Iw2MNB3P+vBw9lZRFSpUCDdcIB/OtSpt70nGk7fnyviTuaevACU9Q2fz31VoK3HpaGsrp3R3QnGAeF7g8E/6zXwButdasHrd3aS7bnRK1ODmKLoD3yuCHYWaECLNRJezz
-----END CERTIFICATE-----`;

// Handle the signup POST request
router.post('/signup', async (req, res) => {
    const { firstName, lastName, phone, email, password, studentID } = req.body;
    try {
        // Create new user with the provided data
        const userData = {
            firstName,
            lastName,
            phone,
            email,
            password,
            studentID,
            role: 'Student'
        };
        const newUser = new User(userData);
        const saveUser = await newUser.save();

        if (saveUser) {
            // Create a profile based on the user's role
            try {
                const fullName = `${firstName} ${lastName}`;

                const StudentProfile = require('../models/StudentProfile');

                // Create a default student profile
                const defaultStudentProfile = new StudentProfile({
                    userId: saveUser._id,
                    studentID: studentID,
                    name: fullName,
                    bio: "",
                    major: "",
                    currentYear: "Not Specified",
                    coursesEnrolled: [],
                    areasOfInterest: [],
                    preferredLearningStyle: "Not Specified",
                    academicGoals: "",
                    profilePicture: null
                });

                await defaultStudentProfile.save();
                console.log('Default student profile created for user:', saveUser._id);
            } catch (profileError) {
                console.error('Error creating default profile:', profileError);
                // Continue anyway, as the user was successfully created
            }

            res.status(201).json({ message: 'Signup successful', user: saveUser });
            console.log('User saved successfully:', saveUser);
        }
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Error saving user', error: error.message });
    }
});

// Handle the login POST request
router.post('/login', async (req, res) => {
    console.log('Login request received with body:', req.body);

    // Validate request data
    if (!req.body || !req.body.email || !req.body.password) {
        console.log('Missing required fields in login request');
        return res.status(400).json({ error: "Email and password are required" });
    }

    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(400).json({ error: "Invalid email or password" });
        }

        console.log('User found:', user.email);

        // Compare the plain password with the hashed password using the model method
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Password does not match for user:', user.email);
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Create a user session similar to the SSO flow
        if (req.session) {
            req.session.user = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                studentID: user.studentID || null
            };

            console.log('Session created for user:', user.email);
        }

        return res.status(200).json({
            success: true,
            role: user.role,
            ID: user._id,
            id: user._id,
            user: {
                id: user._id,
                role: user.role,
                email: user.email
            },
            message: `Login successful as ${user.role}`
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// === SSO Authentication Routes ===
// Route to initiate SAML authentication
router.get('/saml', passport.authenticate('saml', { failureRedirect: '/' }));

// SAML callback route
router.post('/saml/callback',
    passport.authenticate('saml', { failureRedirect: '/' }),
    async (req, res) => {
        console.log("SAML authentication successful:", req.user);

        try {
            const firstName = req.user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] || "Unknown";
            const lastName = req.user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] || "Unknown";
            const phone = req.user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone/PhoneNumber'] || "Unknown";
            const email = req.user.nameID;
            const studentID = req.user['StudentNumber'] || req.user.StudentNumber;

            let user = await User.findOne({ email });
            let isNewUser = false;

            if (!user) {
                isNewUser = true;
                user = new User({
                    firstName,
                    lastName,
                    email,
                    phone,
                    studentID,
                    password: null,
                    role: "Student",
                    isSSO: true
                });
                await user.save();
            }

            req.session.user = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                studentID: user.studentID || null
            };

            console.log("User session stored:", req.session.user);

            if (isNewUser) {
                try {
                    const fullName = `${firstName} ${lastName}`;
                    const StudentProfile = require('../models/StudentProfile');
                    const existingProfile = await StudentProfile.findOne({ userId: user._id });
                    if (!existingProfile) {
                        const defaultStudentProfile = new StudentProfile({
                            userId: user._id,
                            studentID: studentID,
                            name: fullName,
                            bio: "",
                            major: "",
                            currentYear: "Not Specified",
                            coursesEnrolled: [],
                            areasOfInterest: [],
                            preferredLearningStyle: "Not Specified",
                            academicGoals: "",
                            profilePicture: null
                        });
                        await defaultStudentProfile.save();
                        console.log('Default student profile created for SSO user:', user._id);
                    }
                } catch (profileError) {
                    console.error('Error creating profile for SSO user:', profileError);
                }
            }

            req.session.save((err) => {
                if (err) {
                    console.error("Session save error:", err);
                    return res.status(500).json({ error: "Failed to save session" });
                }
                res.redirect(`${FRONTEND_URL}/home`);
            });

        } catch (error) {
            console.error("SAML Login Error:", error);
            res.status(500).json({ message: "Error logging in with SSO", error: error.message });
        }
    });

// Get current session
router.get('/session', (req, res) => {
    if (req.session && req.session.user) {
        return res.json({ user: req.session.user });
    } else {
        return res.status(401).json({ error: "Not authenticated" });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout(() => {
        req.session.destroy((err) => {
            if (err) {
                console.error("Session destruction error:", err);
                return res.status(500).json({ error: "Logout failed" });
            }

            res.clearCookie("connect.sid", { path: "/" });
            res.json({ message: "Logged out successfully" });
            console.log("User logged out successfully");
        });
    });
});

// Export the SAML strategy configuration so it can be used in server.js
module.exports.samlConfig = {
    entryPoint: SAML_ENTRY_POINT,
    issuer: SAML_ISSUER,
    callbackUrl: SAML_CALLBACK_URL,
    logoutUrl: SAML_LOGOUT_URL,
    identifierFormat: null,
    acceptedClockSkewMs: -1,
    disableRequestedAuthnContext: true,
    cert: SAML_CERT.replace(/\n/g, '\n')
};

module.exports.router = router;

// Handles MSAL Login POST requests
router.post('/microsoft-login', async (req, res) => {
   
    //  Find user by email from DB
    const { email } = req.body;

  try {
        // Check if user exists within the DB
        const user = await User.findOne({ email });

        if (!user) {
        console.log('User not found for email:', email);
        return res.status(400).json({ error: "Invalid email or password" });
        }

        // Create a Microsoft user session
        if (req.session) {
            req.session.user = {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    studentID: user.studentID || null
            }
        };

        console.log("Microsoft user session created:", req.session.user);

        res.json({ success: true, message: "Microsoft login successful", user: req.session.user });
  } catch (err) {
    console.error("Error during Microsoft login:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
