import api from './axiosInstance'

export const triggerPredict  = ()   => api.post('/predict')
export const getResults      = ()   => api.get('/results')
export const getStudents     = ()   => api.get('/educator/students')
