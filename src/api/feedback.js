import api from './axiosInstance'

export const submitFeedback = (data) => api.post('/feedback', data)
