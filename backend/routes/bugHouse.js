const express = require("express");
const router = express.Router();
const BugHouse = require("../models/BugHouse");
const multer = require('multer');
const upload = multer();

// Get BugHouse settings
router.get("/", async (req, res) => {
  try {
    const settings = await BugHouse.findOne();
    res.json(settings);
  } catch (error) {
    console.error("Error fetching BugHouse settings:", error);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
});

// Update BugHouse settings (admin only)
router.put("/", upload.single('logo'), async (req, res) => {
  try {
    // Get contact info from body (it was sent as JSON string)
    const contactInfo = JSON.parse(req.body.contactInfo);
    
    // Get logo file from multer
    let logo = null;
    if (req.file) {
      // Convert file buffer to base64
      logo = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    let settings = await BugHouse.findOne();

    if (!settings) {
      settings = new BugHouse({ 
        logo: logo,
        contactInfo: contactInfo 
      });
    } else {
      if (logo) {
        settings.logo = logo;
      }
      settings.contactInfo = contactInfo;
    }

    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error("Error updating BugHouse settings:", error);
    res.status(500).json({ message: "Failed to update settings" });
  }
});

module.exports = router;
