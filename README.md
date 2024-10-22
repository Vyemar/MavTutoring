# bugHouse - CSE Student Success Center Tutoring Web Application

## Project Overview

The bugHouse project is a web application designed to manage student-tutor interactions at the CSE Student Success Center. The application handles user authentication, tutor scheduling, session management, and attendance tracking, with a role-based access system for students, tutors, and administrators.

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
- **Platform**: The application is developed using a modern tech stack including [your chosen front-end framework], [your back-end technology], and [your database].
- **Scalability**: Designed to handle a growing number of users and sessions.
- **Performance**: Ensures fast load times and minimal latency.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ethyn-N/bugHouse.git
