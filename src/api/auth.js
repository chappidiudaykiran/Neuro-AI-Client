import api from './axiosInstance'

export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser    = (data) => api.post('/auth/login', data)
export const googleAuth   = (data) => api.post('/auth/google', data)
export const changePassword = (data) => api.post('/auth/change-password', data)
export const updateProfile = (data) => api.put('/auth/profile', data)
