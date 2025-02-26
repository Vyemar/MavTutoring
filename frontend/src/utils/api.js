import axios from 'axios';

// export const axiosPostData = async (url, data) => {
//     try {
//         const response = await axios.post(url, data);
//         return response.data;
//     } catch (error) {
//         console.error("Error posting data", error);
//         throw error;
//     }
// };

// Function to send POST requests
export const axiosPostData = async (url, data) => {
    try {
        const response = await axios.post(url, data, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to send GET requests
export const axiosGetData = async (url) => {
    try {
        const response = await axios.get(url, { withCredentials: true }); // Ensures cookies are sent
        return response.data;
    } catch (error) {
        throw error;
    }
};
