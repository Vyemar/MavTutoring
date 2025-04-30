# bugHouse - CSE Student Success Center Tutoring Web Application

## Project Overview

The bugHouse project is a web application designed to manage student-tutor interactions at the CSE Student Success Center. The application handles user authentication, tutor scheduling, session management, and attendance tracking, with a role-based access system for students, tutors, and administrators.

## Tech Stack
- **Frontend**: React.js, React-Big-Calendar, DayPilot Lite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

### Frontend (`/frontend`)
The frontend is a React application with the following structure:

```
frontend/
├── src/
│   ├── components/     
│   │   ├── Sidebar/    # Navigation sidebar component
│   │   └── ...         # Other reusable UI components
│   ├── pages/         
│   │   ├── admin/      # Admin-specific pages and components
│   │   ├── student/    # Student-specific pages and components
│   │   ├── tutor/      # Tutor-specific pages and components
│   │   └── ...         # Other shared pages
│   ├── styles/        # CSS and styling files
│   ├── utils/         # Utility functions and helpers
│   ├── App.js         # Main application component
│   └── index.js       # Application entry point
```

### Backend (`/backend`)
The backend is a Node.js/Express application with the following structure:

```
backend/
├── models/          # MongoDB models and schemas
├── routes/          # API endpoints and route handlers
├── ssl/             # SSL certificates
└── server.js        # Main server file
```

## API Endpoints

### Authentication (`/routes/auth.js`)
- User registration and login
- Password management
- JWT token handling

### User Management (`/routes/users.js`)
- User CRUD operations
- Role management
- Profile updates

### Session Management (`/routes/sessions.js`)
- Session creation and management
- Session scheduling
- Session status tracking

### Profile Management (`/routes/profile.js`)
- Student and tutor profile management
- Profile updates
- Profile verification

### Attendance (`/routes/attendance.js`)
- Attendance tracking
- Attendance reports
- Session check-in/out

### Feedback System (`/routes/feedback.js`)
- Feedback submission
- Feedback review
- Rating system

### Analytics (`/routes/analytics.js`)
- System statistics
- Performance metrics
- Usage reports

### Availability (`/routes/availability.js`)
- Tutor availability management
- Schedule conflicts
- Time slot management

### BugHouse Configuration (`/routes/bugHouse.js`)
- System settings
- Configuration management
- System parameters


## Features

### 1. **User Authentication**

- **Sign Up**: Users can create an account with their email, password, and basic profile information (name and contact info).
- **Sign In with ID Card**: Students sign in using their ID card (RFID, barcode, or QR code).
- **Sign Out**: Students sign out using their ID card, with accurate session tracking and attendance logging.
- **Password Management**: Users can reset their password via email if forgotten.
- **Role-Based Access**: Defined roles for Admins, Tutors, and Students, each with appropriate access levels.

### 2. **Tutor Scheduling**

- **Availability Management**: Tutors submit their preferred availability.
- **Admin Scheduling**: Admins review tutor availability and finalize the schedule.
- **Notifications**: Tutors and students receive notifications regarding schedules and session bookings.
- **Calendar Integration**: Optionally sync finalized schedules with external calendars like Google Calendar.

### 3. **Session Management**

- **Session Booking**: Students can book sessions with available tutors based on the finalized schedule.
- **Session Confirmation**: Tutors and students receive notifications via email/SMS for bookings, updates, or cancellations.

### 4. **Attendance Tracking**

- **Session Check-In/Check-Out**: Students check in and out of their sessions using their ID cards, recording session durations accurately.

### 5. **Reports**

- **Tutor Performance Reports**: Track the number of sessions, ratings, and feedback for tutors.
- **Student Attendance Reports**: Monitor attendance patterns and engagement.
- **Custom Reports**: Admins can generate reports based on specific criteria.

### 6. **User Management**

- **Profile Management**: Admins can manage user profiles for both tutors and students.
- **Account Verification**: Admins verify tutor profiles before activation.
- **Role Assignment**: Admins can assign or modify roles (Admin, Tutor, Student).
- **ID Card Management**: Admins can issue and manage ID cards for users.

### 7. **Additional Features**

- **Profiles**: Tutors and students can update their profiles with relevant information.
- **Ratings & Reviews**: Students can rate and provide feedback on tutors after sessions.
- **Notifications**: Implemented for session reminders, updates, and important announcements.

### 8. **Security and Compliance**

- **Data Protection**: Ensures compliance with relevant data protection regulations.
- **Secure Authentication**: Utilizes encrypted ID card data and secure session management.
- **Access Control**: Role-based access ensures appropriate permissions for different user roles.

### 9. **User Interface**

- **Responsive Design**: The application works seamlessly on desktops, tablets, and smartphones.
- **User-Friendly Interface**: Provides an intuitive experience for all users.

## Technical Requirements

- **Platform**: The application is developed using a modern tech stack including React front-end and MongoDB back-end database.
- **Scalability**: Designed to handle a growing number of users and sessions.
- **Performance**: Ensures fast load times and minimal latency.

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/Ethyn-N/bugHouse.git
   ```

2. Install dependencies:

   For backend:

   ```bash
   cd bugHouse/backend
   npm install
   ```

   For frontend:

   ```bash
   cd bugHouse/frontend
   npm install
   ```

## Running the Application

### Development Mode

1. Start the backend server:

   ```bash
   cd bugHouse/backend
   npm start
   ```

   This will start the backend server on port 4000 as configured in your .env file.

2. In a separate terminal, start the frontend development server:
   ```bash
   cd bugHouse/frontend
   npm start
   ```
   This will launch the React development server on port 3000, and open the application in your default web browser.

### Environment Variables

Make sure to set up the required environment variables before running the application:

1. Create a `.env` file in the backend directory with the following variables:

   ```
   DB=mongodb+srv://username:password@bughouse.qllqm.mongodb.net/bugHouse_db?retryWrites=true&w=majority
   BACKEND_PORT=4000
   FRONTEND_PORT=3000
   PROTOCOL=http
   BACKEND_HOST=localhost
   FRONTEND_HOST=localhost
   SESSION_SECRET=your_session_secret_here
   ```

2. Create a `.env` file in the frontend directory:
   ```
   REACT_APP_PROTOCOL=http
   HTTPS=false
   REACT_APP_BACKEND_HOST=localhost
   REACT_APP_BACKEND_PORT=4000
   ```

## Troubleshooting

If you encounter issues when running the application:

- Check that all dependencies are installed correctly
- Verify that MongoDB is running and accessible
- Ensure that environment variables are set correctly
- Check the console for error messages
