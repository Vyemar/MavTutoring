const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import User model

// Fetch all users (for reference)
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.get('/tutors/:search', async (req, res) => {
  try {
    const searchValue = req.params.search;
    const tutors = await User.aggregate([
      {
        $lookup: {
          from: 'tutorprofiles',
          localField: '_id',
          foreignField: 'userId',
          as: 'profile',
        },
      },
      {
        $unwind: {
          path: '$profile',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match:
          searchValue === 'ALL'
            ? { $and: [{ role: 'Tutor' }] }
            : {
                $and: [
                  { role: 'Tutor' },
                  {
                    $or: [
                      { firstName: { $regex: searchValue, $options: 'i' } },
                      { lastName: { $regex: searchValue, $options: 'i' } },
                      {
                        'profile.courses': {
                          $regex: searchValue,
                          $options: 'i',
                        },
                      },
                    ],
                  },
                ],
              },
      },
    ]);
    res.status(200).json(tutors);
  } catch (err) {
    console.error('Error searching tutors:', err);
    res.status(500).json({ message: 'Failed to search tutors' });
  }
});

// Fetch only tutors
router.get('/tutors', async (req, res) => {
  try {
    const tutors = await User.find({ role: 'Tutor' }); // Fetch users with role "Tutor"
    res.status(200).json(tutors);
  } catch (err) {
    console.error('Error fetching tutors:', err);
    res.status(500).json({ message: 'Failed to fetch tutors' });
  }
});

// NEW ROUTE: Fetch a single user by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('Fetching user with ID:', userId);

    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user.firstName, user.lastName);
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res
      .status(500)
      .json({ message: 'Failed to fetch user', error: err.message });
  }
});

module.exports = router;
