import axiosClient from './axiosClient';

// Admin
export const createCoupon = (payload) =>
  axiosClient.post('/api/admin/coupons', payload).then((res) => res.data);

export const getAllCoupons = () =>
  axiosClient.get('/api/admin/coupons').then((res) => res.data);

export const deactivateCoupon = (id) =>
  axiosClient.patch(`/api/admin/coupons/${id}/deactivate`).then((res) => res.data);

// Customer
export const redeemCoupon = (couponCode, subscriptionId) =>
  axiosClient.post('/api/customer/coupons/redeem', { couponCode, subscriptionId }).then((res) => res.data);
