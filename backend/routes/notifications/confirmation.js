const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');
require('dotenv').config();
const Notification = require("../../models/Notification");

router.post("/send-notification", async (req, res) => {
    try {
        const { recipientId, type, message, email, name } = req.body;

        // Store notification in the database
        const notification = new Notification({
            userId: recipientId,
            message
        });

        await notification.save();

        // Send Email Notification
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_SERVER,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        const templateData = {
            name,
            message,
            subject: type === "appointment_confirmation" ? "Your Appointment is Confirmed" : "New Booking Alert",
        };
        const htmlContent = await ejs.renderFile(path.join(__dirname, 'views', 'email-template.ejs'), templateData);

        const mailOptions = {
            from: process.env.SMTP_USERNAME,
            replyTo: process.env.SMTP_PROXY_EMAIL,
            to: email,
            subject: type === "appointment_confirmation" ? "Your Appointment is Confirmed" : "New Booking Alert",
            //   text: message
            html: htmlContent
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).send("Error sending email");
            }
            console.log("Email sent: " + info.response);
            return res.status(200).json({ message: "Notification created & email sent" });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get Notifications for a User
router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const notifications = await Notification.find({ recipientId: userId }).sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
});

// Mark Notification as Read
router.patch("/mark-as-read/:id", async (req, res) => {
    try {
        const notificationId = req.params.id;
        await Notification.findByIdAndUpdate(notificationId, { isRead: true });

        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error updating notification" });
    }
});

module.exports = router;