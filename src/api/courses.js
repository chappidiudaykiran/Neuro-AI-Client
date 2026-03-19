import api from './axiosInstance'

export const getCourses      = ()   => api.get('/courses')
export const getCategoriesSummary = () => api.get('/courses/summary')
export const getCoursesByCategory = (categorySlug) => api.get(`/courses/category/${categorySlug}`)
export const getCourseById   = (id) => api.get(`/courses/${id}`)
export const createSubject   = (data) => api.post('/courses', data)
export const updateSubject   = (id, data) => api.put(`/courses/${id}`, data)
export const deleteSubject   = (id) => api.delete(`/courses/${id}`)
export const saveWatchTime   = (data) => api.post('/watch', data)
