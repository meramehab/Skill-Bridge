import { useState, useEffect, useCallback } from 'react';
import projectsService from '../services/projects.service';

const useProjects = (filters = {}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectsService.getProjects(filters);
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'حصل خطأ في تحميل المشاريع');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
};

export default useProjects;
