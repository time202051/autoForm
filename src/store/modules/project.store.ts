import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { useProjectCache } from "@/hooks";

// 定义项目类型
interface Project {
  id: string;
  name: string;
  description: string;
  address: string;
}
export const useProjectStore = defineStore('project', () => {
  // 项目列表
  const projects = useStorage<Project[]>('project-store-projects', []);

  // 当前选中的项目数据
  const selectedProject = useStorage<any>('project-store-selected-project', {});
  type ModuleType = 'search' | 'actionBar' | 'table' | 'pagination' | ''

  const selectedModule = ref<ModuleType>('')
  /**
   * 添加项目
   * @param project - 项目对象
   */
  const addProject = (project: Project) => {
    projects.value.push({
      ...project,
    });
  };

  /**
   * 删除项目
   * @param id - 项目 ID
   */
  const deleteProject = (id: string) => {
    const projectCache = useProjectCache();
    projects.value = projects.value.filter((project) => project.id !== id);
    // 如果删除的是当前选中的项目，清空选中状态
    if (selectedProject.value?.id === id) {
      selectedProject.value = null;
    }
    projectCache.deleteProject(id)
  };

  /**
   * 更新项目
   * @param id - 项目 ID
   * @param updatedProject - 更新后的项目对象
   */
  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    const project = projects.value.find((project) => project.id === id);
    if (project) {
      Object.assign(project, updatedProject);
      // 如果更新的是当前选中的项目，同步更新 selectedProject
      if (selectedProject.value?.id === id) {
        selectedProject.value = { ...selectedProject.value, ...updatedProject };
      }
    }
  };

  /**
   * 选中项目
   * @param project - 项目对象
   */
  const selectProject = (project: Project) => {
    selectedProject.value = project;
  };

  /**
   * 获取当前选中的项目
   */
  const getSelectedProject = () => {
    return selectedProject.value;
  };

  const setSelectedModule = (module: string) => {
    selectedModule.value = module
  }

  return {
    projects,
    selectedProject,
    selectedModule,
    addProject,
    deleteProject,
    updateProject,
    selectProject,
    getSelectedProject,
    setSelectedModule
  };
});
