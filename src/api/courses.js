import api from './axiosInstance'

export const getCourses      = ()   => api.get('/courses')
export const getCourseById   = (id) => api.get(`/courses/${id}`)
export const createSubject   = (data) => api.post('/courses', data)
export const saveWatchTime   = (data) => api.post('/watch', data)
