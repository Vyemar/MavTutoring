const express = require('express')
const router = express.Router();
const Course = require('../models/Course')

// Middleware to check if user is logged in and is Admin
function requireAdmin(req, res, next) {
  const user = req.session?.user;
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  if (user.role !== 'Admin') {
    return res.status(403).json({ message: 'Admins only' });
  }
  next();
}

// GET all courses
router.get('/', async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
});

// POST create new course
router.post('/', requireAdmin, async (req, res) => {
    const { title, code, description } = req.body;
    try {
        const newCourse = new Course({ title, code, description });
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update course
router.put('/:id', requireAdmin, async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(course);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE course
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted'});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;