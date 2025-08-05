const express = require("express");
const router = express.Router();
const Session = require("../../models/Session");
const { AiFillFacebook } = require("react-icons/ai");
const mongoose = require('mongoose');
const multer = require('multer');

// Get schedule for a tutor
router.get("/tutor/:tutorID", async (req, res) => {
    try {
        const sessions = await Session.find({ tutorID: req.params.tutorID })
            .populate("studentID", "firstname lastname") // Fetch student details
            .sort({ sessionTime: 1 }); // Sort by session time
    } catch (err) {
        console.error("Error fetching tutor schedule:", err);
        res.status(500).json({ message: "Failed to fetch tutor schedule" });
    }
});

router.get("/tutor/:tutorID/files", async (req, res) => {
    try{
        const tutorID = req.params.tutorID;
        const sessions = await Session.find({tutorID});
        const allTutorUploads = sessions.flatMap(session => (session.uploads || []).map(upload => ({
            sessionId: session._id,
            fileName: upload.fileName,
            originalName: upload.originalName,
            //filePath: upload.filePath,
            uploadedAt: upload.uploadDate,
    }))
        );
        res.json(allTutorUploads);  
    } catch(err) {
        console.error("Error fetching tutor files:", err);
        res.status(500).json({message: "Failed to fetch tutor files"});
    }
    });

    router.get('/file/:id', async(req,res)=> {
        try{
            const fileId = await mongoose.Types.ObjectId(req.params.id);
            const file = await gfs.files.find({_id: fileId}).toArray();
            if(!file)
                return res.status(404).json({message: 'file not found'});
            const readStream = gfs.createReadStream({_id: fileId});
            res.set('Content-Type', file.contentType);
            return readStream.pipe(res);
        }
        catch(err){
            console.error('File fetch error', err);
            return res.status(500).json({message: 'could not retrieve file'});
        }
    });



module.exports = router;
