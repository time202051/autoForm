<template>
  <div class="project-management">
    <!-- 项目卡片列表 -->
    <div class="project-list">
      <el-card
        v-for="project in projects"
        :key="project.id"
        class="project-card"
        @click="goToDashboard(project)"
        :class="{ 'card-hover': isHovered === project.id }"
        @mouseenter="isHovered = project.id"
        @mouseleave="isHovered = null"
      >
        <!-- 卡片内容 -->
        <h3>{{ project.name }}</h3>
        <p>主键：{{ project.key }}</p>

        <!-- 编辑和删除按钮 -->
        <div v-if="isHovered === project.id" class="card-actions">
          <el-button
            :icon="Edit"
            type="primary"
            circle
            @click.stop="editProject(project)"
          ></el-button>
          <el-button
            :icon="Delete"
            type="danger"
            circle
            @click.stop="deleteProject(project.id)"
          ></el-button>
        </div>
      </el-card>

      <!-- 新建项目卡片 -->
      <el-card class="project-card add-card" @click="addProject">
        <span>+</span>
      </el-card>
    </div>

    <!-- 添加/编辑项目弹框 -->
    <el-dialog v-model="showDialog" :title="isEditing ? '编辑项目' : '添加项目'" width="30%">
      <el-form :model="currentProject" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="currentProject.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="currentProject.key" placeholder="请输入项目地址" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="currentProject.description" placeholder="请输入项目备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="saveProject">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useProjectStore } from "@/store";
import { Edit, Delete } from "@element-plus/icons-vue";
import dayjs from "dayjs";
const projectStore = useProjectStore();
const router = useRouter();

// 项目列表
const projects = computed(() => projectStore.projects);

// 弹框显示状态
const showDialog = ref(false);

// 当前编辑的项目
const currentProject = ref({
  id: "",
  name: "",
  description: "",
  key: "",
});

// 是否处于编辑模式
const isEditing = ref(false);

// 鼠标悬停的项目 ID
const isHovered = ref(null);

// 显示添加项目弹框
const addProject = () => {
  const timestamp = dayjs().format("YYYYMMDDHHmmss");
  currentProject.value = { id: `project-${timestamp}`, name: "", description: "", key: "" };
  isEditing.value = false;
  showDialog.value = true;
};

// 显示编辑项目弹框
const editProject = (project) => {
  currentProject.value = { ...project };
  isEditing.value = true;
  showDialog.value = true;
};

// 保存项目
const saveProject = () => {
  if (isEditing.value) {
    projectStore.updateProject(currentProject.value.id, currentProject.value);
  } else {
    projectStore.addProject(currentProject.value);
  }
  showDialog.value = false;
};

// 删除项目
const deleteProject = (id) => {
  projectStore.deleteProject(id);
};

// 跳转到 dashboard 页面
const goToDashboard = (project) => {
  const { key } = project;
  router.push({ path: `projectConfig/${key}` });
};
</script>

<style scoped>
.project-management {
  padding: 20px;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/images/pageBg.png"); /* 引用背景图片 */
  background-size: cover; /* 使图片覆盖整个页面 */
  background-position: center; /* 图片居中显示 */
  background-attachment: fixed; /* 背景图片固定，不随页面滚动 */
}

.project-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.project-card {
  width: 200px;
  height: 160px;
  text-align: center;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  position: relative;
}

.project-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.add-card {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background-color: #f0f0f0;
}

.add-card:hover {
  background-color: #e0e0e0;
}

.card-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 8px;
  z-index: 99999;
}

.card-actions .el-button {
  padding: 6px;
  font-size: 14px;
}
</style>
