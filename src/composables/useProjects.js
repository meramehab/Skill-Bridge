import { computed } from 'vue'
import { useProjectsStore } from '@/store/projects'

export function useProjects() {
  const projectsStore = useProjectsStore() 
  const projects = computed(() => projectsStore.getAllProjects)
  const activeProjects = computed(() => projectsStore.getActiveProjects)
  const completedProjects = computed(() => projectsStore.getCompletedProjects)
  const isLoading = computed(() => projectsStore.isLoading)

  const fetchProjects = async () => {
    await projectsStore.fetchProjects()
  }

  const getProject = (id) => {
    return projectsStore.getProjectById(id)
  }

  const createProject = async (data) => {
    return await projectsStore.createProject(data)
  }

  const applyToProject = async (projectId) => {
    return await projectsStore.applyToProject(projectId)
  }

  return {
    projects,
    activeProjects,
    completedProjects,
    isLoading,
    fetchProjects,
    getProject,
    createProject,
    applyToProject,
  }
