import api from './api';

const register = async ({ fullName, email, password, university, role }) => {
  const { data } = await api.post('/auth/register', { fullName, email, password, university, role });
  return data.data;
};

const login = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data;
};

const getMe = async () => {
  const { data } = await api.get('/users/me');
  return data.data;
};

export default { register, login, getMe };
