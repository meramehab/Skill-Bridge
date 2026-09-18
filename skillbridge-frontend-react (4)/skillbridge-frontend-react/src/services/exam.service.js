import api from './api';

const getExamQuestions = async (courseId) => {
  const { data } = await api.get(`/courses/${courseId}/exam`);
  return data.data;
};

const submitExam = async (courseId, answers) => {
  const { data } = await api.post(`/courses/${courseId}/exam/submit`, { answers });
  return data.data;
};

export default { getExamQuestions, submitExam };
