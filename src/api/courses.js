import api from './axiosInstance'

export const getCourses      = ()   => api.get('/courses')
export const getCourseById   = (id) => api.get(`/courses/${id}`)
export const saveWatchTime   = (data) => api.post('/watch', data)
