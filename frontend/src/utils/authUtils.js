import { axiosGetData } from "../utils/api";

export const handleLogout = async () => {
    try {
        await axiosGetData("https://localhost:4000/api/auth/logout"); // Call logout API
    } catch (error) {
        console.error("Logout failed:", error);
    }

    localStorage.clear(); // Ensure local storage is cleared
    sessionStorage.clear(); // Clear session storage
    window.location.href = "/login"; // Redirect to login immediately
};