// src/api.js
import axios from 'axios';

export const api = axios.create({
  //baseURL: 'http://localhost:4000', 
  baseURL: 'https://voo0rhkip9.execute-api.eu-north-1.amazonaws.com/1',
  
  
  
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`; // ✅ Fix here
  return config;
});
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers['Authorization'] = token;
//   return config;
// });