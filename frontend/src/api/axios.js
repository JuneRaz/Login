import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:7000' // Ensure this is correct
});

export default axiosInstance;
