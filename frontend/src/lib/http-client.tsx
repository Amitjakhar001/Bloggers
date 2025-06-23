// lib/http-client.ts
import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance for user service
export const userServiceClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:5000',
    timeout: 10000,
});

// Create axios instance for blog service
export const blogServiceClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BLOG_SERVICE_URL || 'http://localhost:5002',
    timeout: 10000,
});

// Create axios instance for author service
export const authorServiceClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AUTHOR_SERVICE_URL || 'http://localhost:5001',
    timeout: 10000,
});

// Request interceptor to add token to all requests
const addTokenInterceptor = (client: typeof axios) => {
    client.interceptors.request.use(
        (config) => {
            const token = Cookies.get('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

// Response interceptor to handle auth errors
const addResponseInterceptor = (client: typeof axios) => {
    client.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Token is invalid, clear it and redirect to login
                Cookies.remove('token');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );
};

// Apply interceptors to all clients
[userServiceClient, blogServiceClient, authorServiceClient].forEach(client => {
    addTokenInterceptor(client);
    addResponseInterceptor(client);
});

export default {
    userService: userServiceClient,
    blogService: blogServiceClient,
    authorService: authorServiceClient,
};