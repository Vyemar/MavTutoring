import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles/ViewTutors.module.css';

function ViewTutors() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all users from the backend
        axios.get('http://localhost:4000/users')
            .then((response) => {
                // Filter users to only include those with the role "Tutor"
                const tutors = response.data.filter(users => users.role === 'Tutor');
                setUsers(tutors);
                setLoading(false);
                console.log('Fetching users with role Tutor'); //
                console.log('Query result:', tutors); //Testing purpose
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Our Tutors</h1>
            {users.length > 0 ? (
                <table className={styles.userTable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No tutors found in the system.</p>
            )}
        </div>
    );
            }

export default ViewTutors;
