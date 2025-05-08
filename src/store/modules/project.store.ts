import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

// 定义项目类型
interface Project {
  id: string;
  name: string;
  description: string;
  address: string;
}

// 定义 store
export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [] as Project[], // 项目列表
  }),
  actions: {
    /**
     * 添加项目
     * @param project - 项目对象
     */
    addProject(project: Omit<Project, 'id'>) {
      this.projects.push({
        id: uuidv4(), // 生成唯一 ID
        ...project,
      });
    },

    /**
     * 删除项目
     * @param id - 项目 ID
     */
    deleteProject(id: string) {
      this.projects = this.projects.filter((project) => project.id !== id);
    },

    /**
     * 更新项目
     * @param id - 项目 ID
     * @param updatedProject - 更新后的项目对象
     */
    updateProject(id: string, updatedProject: Partial<Project>) {
      const project = this.projects.find((project) => project.id === id);
      if (project) {
        Object.assign(project, updatedProject);
      }
    },
  },
  persist: true, // 启用持久化
});
