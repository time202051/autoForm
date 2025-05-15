<template>
  <div>
    <!-- 添加根菜单的按钮 -->
    <el-button type="primary" style="margin-bottom: 16px" @click="openMenuDialog(null, false)">
      添加根菜单
    </el-button>

    <!-- 菜单树 -->
    <el-tree :data="menus" node-key="id" default-expand-all :expand-on-click-node="false">
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ data.meta.title }}</span>
          <span>
            <el-button link @click="openMenuDialog(data, false)">编辑</el-button>
            <el-button link @click="addChild(data)">添加子菜单</el-button>
            <el-button link @click="removeMenu(node, data)">删除</el-button>
          </span>
        </span>
      </template>
    </el-tree>

    <!-- 保存和取消按钮 -->
    <div style="margin-top: 16px" class="btn-box">
      <el-button @click="emit('cancel')">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>

    <!-- 菜单编辑对话框 -->
    <el-dialog v-model="dialogVisible" title="编辑菜单" width="30%">
      <el-form :model="currentMenu" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="currentMenu.meta.title" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="currentMenu.pathField" placeholder="请输入菜单路径" />
        </el-form-item>
        <el-form-item label="菜单图标">
          <el-input v-model="currentMenu.meta.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item label="是否隐藏">
          <el-switch v-model="currentMenu.meta.hidden" />
        </el-form-item>
        <el-form-item label="是否缓存">
          <el-switch v-model="currentMenu.meta.keepAlive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmMenu">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { v4 as uuidv4 } from "uuid"; // 引入 uuid 库
import { usePermissionStore } from "@/store";
import { cloneDeep } from "lodash";
import type { RouteRecordRaw } from "vue-router";
import { useProjectCache } from "@/hooks";

const emit = defineEmits(["save", "cancel"]);
const permissionStore = usePermissionStore();
const projectCache = useProjectCache();

const router = useRouter();
const menus = ref<any[]>([]);
const dialogVisible = ref(false);
const currentMenu = ref<any>({
  pathField: "",
  componentField: "",
  name: "",
  meta: {
    title: "",
    icon: "",
    hidden: false,
    keepAlive: false,
  },
  children: [],
});
const isEditing = ref(false);
const parentMenu = ref<any>(null); // 用于存储父菜单

//获取缓存的路由数据
onMounted(() => {
  menus.value = permissionStore.dynamicMenus;
});

// 打开菜单编辑对话框
const openMenuDialog = (menu: any, isSon: boolean) => {
  if (menu) {
    // 编辑现有菜单

    currentMenu.value = { ...cloneDeep(menu) }; // 确保 path 被正确绑定
    isEditing.value = true;
  } else {
    const id = `page-${uuidv4()}`;
    // 添加新菜单
    currentMenu.value = {
      id,
      pathField: "",
      componentField: isSon ? "projectConfig/index" : "Layout",
      name: "",
      meta: {
        id,
        title: "",
        icon: "el-icon-User",
        hidden: false,
        keepAlive: false,
      },
      children: [],
      isSon: isSon,
    };
    isEditing.value = false;
  }
  dialogVisible.value = true;
};

// 递归查找并更新菜单
const updateMenu = (menus: any[], id: string, newData: any): boolean => {
  for (let i = 0; i < menus.length; i++) {
    if (menus[i].id === id) {
      // 找到匹配的菜单项，更新数据
      Object.assign(menus[i], newData);
      return true;
    }
    if (menus[i].children && menus[i].children.length > 0) {
      // 递归查找子菜单
      const found = updateMenu(menus[i].children, id, newData);
      if (found) return true;
    }
  }
  return false;
};

// 确认菜单编辑
const confirmMenu = () => {
  if (isEditing.value) {
    // 递归更新现有菜单
    const updated = updateMenu(menus.value, currentMenu.value.id, currentMenu.value);
    if (!updated) {
      ElMessage.error("未找到要编辑的菜单");
    }
  } else {
    // 添加新菜单
    const newMenu = { id: uuidv4(), ...currentMenu.value }; // 使用 uuid 生成唯一 ID
    if (parentMenu.value) {
      // 如果存在父菜单，将新菜单添加到父菜单的 children 中
      parentMenu.value.children = parentMenu.value.children || [];
      parentMenu.value.children.push(newMenu);
    } else {
      // 否则，将新菜单添加到顶级菜单中
      menus.value.push(newMenu);
    }
  }
  dialogVisible.value = false;
  parentMenu.value = null; // 重置父菜单
};

// 添加子菜单
const addChild = (parent: any) => {
  parentMenu.value = parent; // 设置父菜单
  openMenuDialog(null, true); // 打开对话框
};

// 删除菜单
const removeMenu = async (node: any, data: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除菜单 "${data.meta.title}" 吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    const parent = node.parent;
    const children = parent.data.children || parent.data;
    const index = children.findIndex((d: any) => d.id === data.id);
    children.splice(index, 1);
  } catch (error) {
    // 用户点击了取消
    console.log("用户取消了删除操作");
  }
};

// 保存菜单并更新路由
const save = async () => {
  projectCache.saveMenuTree(menus.value);
  const routerTemp = permissionStore.generateRoutesLowCode(menus.value);
  permissionStore.resetRouter();
  const dynamicRoutes = await permissionStore.generateRoutesData(routerTemp);
  dynamicRoutes.forEach((route: RouteRecordRaw) => router.addRoute(route));
  permissionStore.saveDynamicMenus(menus.value);
  emit("cancel");
};
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.btn-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
