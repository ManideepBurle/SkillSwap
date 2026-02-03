// Global API Configuration
// This file should be imported in all files that make API calls

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default API_URL;

// Usage in components:
// import API_URL from '../config/api';
// axios.get(`${API_URL}/user/discover`)
