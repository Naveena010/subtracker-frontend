import axiosClient from './axiosClient';

export const getMyNotifications = (page = 0, size = 50) =>
  axiosClient
    .get(`/api/customer/notifications?page=${page}&size=${size}`)
    .then((res) => res.data);

export const markNotificationRead = (id) =>
  axiosClient.patch(`/api/customer/notifications/${id}/read`).then((res) => res.data);
