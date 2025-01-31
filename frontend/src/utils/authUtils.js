export const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('userID');
    window.location.href = '/login'; // Redirect to login
};