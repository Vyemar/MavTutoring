const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/User"); // your Mongoose User model

// create the same transporter you used in auth.js
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

// verify once on startup
transporter.verify((err, success) => {
  if (err) console.error("SMTP connection error:", err);
  else console.log("SMTP connection OK (mass email)");
});

router.post("/send-mass-email", async (req, res) => {
  const { allTutors, allStudents, extraEmails, subject, message } = req.body;
  let recipients = [];

  // 1) Collect from DB
  if (allTutors) {
    const tutors = await User.find({ role: "Tutor" }, "email");
    recipients.push(...tutors.map(u => u.email));
  }
  if (allStudents) {
    const students = await User.find({ role: "Student" }, "email");
    recipients.push(...students.map(u => u.email));
  }
  // 2) Add any extra
  if (Array.isArray(extraEmails)) {
    recipients.push(...extraEmails);
  }

  // dedupe
  recipients = [...new Set(recipients)];

  if (recipients.length === 0) {
    return res.status(400).json({ error: "No recipients selected." });
  }

  // 3) Send one email with BCC to all
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_FROM,     // you can use a valid "to" or omit
      bcc: recipients,
      subject,
      text: message,
    });
    return res.json({ sentTo: recipients.length });
  } catch (err) {
    console.error("Error in /send-mass-email:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;