import axiosClient from './axiosClient';

export const getMySubscriptions = (page = 0, size = 50) =>
  axiosClient
    .get(`/api/customer/subscriptions?page=${page}&size=${size}&sort=nextBillingDate,asc`)
    .then((res) => res.data);

export const addSubscription = (payload) =>
  axiosClient.post('/api/customer/subscriptions', payload).then((res) => res.data);

export const updateUsage = (id, usedRecently) =>
  axiosClient.patch(`/api/customer/subscriptions/${id}/usage`, { usedRecently }).then((res) => res.data);

export const cancelSubscription = (id) =>
  axiosClient.patch(`/api/customer/subscriptions/${id}/cancel`).then((res) => res.data);

export const deleteSubscription = (id) =>
  axiosClient.delete(`/api/customer/subscriptions/${id}`).then((res) => res.data);
