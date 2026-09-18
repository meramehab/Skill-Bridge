import api from './api';

const getCourses = async (filters = {}) => {
  const { data } = await api.get('/courses', { params: filters });
  return data.data;
};

// نسخة كاملة (بالإجابات الصحيحة) - للأدمن بس
const getCoursesForAdmin = async () => {
  const { data } = await api.get('/courses/admin/all');
  return data.data;
};

const createCourse = async (payload) => {
  const { data } = await api.post('/courses', payload);
  return data.data;
};

const updateCourse = async (id, payload) => {
  const { data } = await api.put(`/courses/${id}`, payload);
  return data.data;
};

const deleteCourse = async (id) => {
  const { data } = await api.delete(`/courses/${id}`);
  return data;
};

const enrollCourse = async (id) => {
  const { data } = await api.post(`/courses/${id}/enroll`);
  return data.data;
};

const getCourseById = async (id) => {
  const { data } = await api.get(`/courses/${id}`);
  return data.data;
};

const checkCourseAccess = async (id) => {
  const { data } = await api.get(`/courses/${id}/access`);
  return data;
};

const getCourseLessons = async (id) => {
  const { data } = await api.get(`/courses/${id}/lessons`);
  return data.data;
};

export default {
  getCourses,
  getCoursesForAdmin,
  getCourseById,
  checkCourseAccess,
  getCourseLessons,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
};

