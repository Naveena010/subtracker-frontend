import axiosClient from './axiosClient';

export const getDashboard = () =>
  axiosClient.get('/api/admin/dashboard').then((res) => res.data);

export const triggerAlerts = () =>
  axiosClient.post('/api/admin/alerts/trigger').then((res) => res.data);
