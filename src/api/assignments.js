import api from './axiosInstance'

// Student
export const submitAssignment = (data) => api.post('/assignments/submit', data)
export const getMySubmissions = (subjectId) => api.get(`/assignments/subject/${subjectId}`)
export const getAllMySubmissions = () => api.get('/assignments/my-submissions')

// Public: get custom assignment for quiz
export const getCustomAssignment = (subjectId, moduleNumber) => api.get(`/assignments/custom/${subjectId}/${moduleNumber}`)

// Admin
export const getAdminAssignments = (subjectId) => api.get(`/assignments/admin/${subjectId}`)
export const upsertAdminAssignment = (data) => api.post('/assignments/admin', data)
export const deleteAdminAssignment = (id) => api.delete(`/assignments/admin/${id}`)
