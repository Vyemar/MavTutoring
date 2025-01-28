import axios from 'axios';

export const axiosPostData = async (url, data) => {
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        console.error("Error posting data", error);
        throw error;
    }
};
