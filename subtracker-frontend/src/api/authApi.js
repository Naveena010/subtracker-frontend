import axiosClient from './axiosClient';

export const login = (email, password) =>
  axiosClient.post('/api/auth/login', { email, password }).then((res) => res.data);

export const register = (fullName, email, password) =>
  axiosClient.post('/api/auth/register', { fullName, email, password }).then((res) => res.data);
