// Example: src/services/api.js or src/config.js
import API_URL from '../js/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default API_URL;