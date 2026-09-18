import api from './api';

const getProjects = async (filters = {}) => {
  const { data } = await api.get('/projects', { params: filters });
  return data.data;
};

const getProjectById = async (id) => {
  const { data } = await api.get(`/projects/${id}`);
  return data.data;
};

const createProject = async (payload) => {
  const { data } = await api.post('/projects', payload);
  return data.data;
};

const getMatchedProjects = async (skills) => {
  const { data } = await api.post('/projects/matched', { skills });
  return data.data;
};

export default { getProjects, getProjectById, createProject, getMatchedProjects };
