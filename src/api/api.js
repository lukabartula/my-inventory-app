import axios from 'axios';

// creating axios instance
const API = axios.create({
    baseURL: 'http://localhost:5000/api', //base backend url
});

// attaching jwt automatically

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;