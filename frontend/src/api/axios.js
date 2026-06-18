import axios from 'axios';
const API = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api',
});
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user && user.token) req.headers.Authorization = 'Bearer ' + user.token;
  return req;
});
export default API;