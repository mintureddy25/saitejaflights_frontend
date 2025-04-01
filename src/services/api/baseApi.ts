import axios from 'axios';
export const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  const token = localStorage.getItem('access_token');
  
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  