const mongoose = require('mongoose');
require('dotenv').config(); //like loading varaibles from .env
const Course = require('./models/Course'); //adjust if your path is different

const courses = [
  { code: 'CSE1105', title: 'Intro to CS and Engineering' },
  { code: 'CSE1310', title: 'Intro to Computers and Programming' },
  { code: 'CSE1320', title: 'Intermediate Programming' },
  { code: 'CSE1325', title: 'Object-Oriented Programming' },
  { code: 'CSE2312', title: 'Computer Organization and Assembly' },
  { code: 'CSE3318', title: 'Algorithms and Data Structures' },
  { code: 'CSE3320', title: 'Operating Systems' },
  { code: 'CSE3330', title: 'Databases' },
  { code: 'CSE3380', title: 'Linear Algebra for CS' },
  { code: 'CSE4303', title: 'Computer Graphics' },
  { code: 'CSE4316', title: 'Software Engineering' }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Course.deleteMany(); //optional
    await Course.insertMany(courses);

    console.log('Courses seeded successfully!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
