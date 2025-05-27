import { inject, unref, reactive, ref } from 'vue';
import type { IPageConfig, IPaginationConfig } from "@/views/projectConfig/src/pageConfig";
import type { IPageDate } from '@/views/projectConfig/index';
export interface IDialogFormData {
  type: 0 | 1 | 2; // 0详情，1新建 2编辑
  visible: boolean;
  title: string;
  formData: Record<string, any>; // 表单数据
}
// 单例对象
let instance: ReturnType<typeof createCrudOperations> | null = null;

const createCrudOperations = () => {
  const pageDate = inject<IPageDate>("pageDate");



  // 获取搜索框数据
  const getSearchData = () => {
    return unref(pageDate)?.pageConfig?.searchConfig?.data!;
  };

  // 获取分页数据
  const getPaginationData = (): IPaginationConfig => {
    return unref(pageDate)?.pageConfig?.pagination!;
  };

  // 获取表格选中的数据
  const getSelectionRows = () => {
    return unref(pageDate)?.baseTableRef.value.LCTableRef.tableRef.store.getSelectionRows()!;
  };

  // 查询逻辑
  const handleSearch = async () => {
    const searchData = { ...getSearchData(), ...getPaginationData() };
    console.log("执行查询逻辑", searchData);
    // 在这里调用查询的 API
    // 示例：const response = await api.search(searchData);
    // 更新表格数据和分页总数
    // tableConfig.value.data = response.data;
    // tableConfig.value.pagination.total = response.total;
    // 修改data 后期删掉
    unref(pageDate)?.pageConfig.data?.push({ name: '测试数据', age: 18 });
  };

  const handleReset = () => {
    const searchData = getSearchData();
    Object.keys(searchData).forEach(key => {
      delete searchData[key];
    });
    const pagination = getPaginationData();
    pagination.currentPage = 1;
    pagination.pageSize = 20;
    pagination.total = 100;
    handleSearch();
  };

  // 新增逻辑
  const handleCreate = async (formData?: Record<string, any>) => {
    console.log("执行新增逻辑", formData);
    formData = formData || {};
    // 在这里调用新增的 API
    // 示例：await api.create(formData);
    // 新增成功后重新查询数据
    await handleSearch();
  };

  // 编辑逻辑
  const handleEdit = async (formData: Record<string, any>) => {
    const selectionRows = getSelectionRows();
    if (selectionRows.length === 0) {
      console.log("请选择要编辑的数据");
      return;
    }
    console.log("执行编辑逻辑", selectionRows, formData);
    // 在这里调用编辑的 API
    // 示例：await api.edit(selectionRows[0].id, formData);
    // 编辑成功后重新查询数据
    await handleSearch();
  };

  // 删除逻辑
  const handleDelete = async () => {
    const selectionRows = getSelectionRows();
    if (selectionRows.length === 0) {
      console.log("请选择要删除的数据");
      return;
    }
    console.log("执行删除逻辑", selectionRows);
    // 在这里调用删除的 API
    // 示例：await api.delete(selectionRows[0].id);
    // 删除成功后重新查询数据
    await handleSearch();
  };

  // 批量删除逻辑
  const handleBatchDelete = async () => {
    const selectionRows = getSelectionRows();
    if (selectionRows.length === 0) {
      console.log("请选择要删除的数据");
      return;
    }
    console.log("执行批量删除逻辑", selectionRows);
    // 在这里调用批量删除的 API
    // 示例：await api.batchDelete(selectionRows.map(row => row.id));
    // 批量删除成功后重新查询数据
    await handleSearch();
  };

  // 导入逻辑
  const handleImport = async (file: File) => {
    console.log("执行导入逻辑", file);
    // 在这里调用导入的 API
    // 示例：await api.import(file);
    // 导入成功后重新查询数据
    await handleSearch();
  };

  // 导出逻辑
  const handleExport = async () => {
    const searchData = { ...getSearchData(), ...getPaginationData() };
    globalThis.setConsole(searchData, '导出参数');
    // 在这里调用导出的 API
    // 示例：await api.export(searchData);
  };

  // 分页逻辑：每页条数变化
  const handleSizeChange = (size: number) => {
    const pagination = getPaginationData();
    pagination.pageSize = size;
    pagination.currentPage = 1; // 重置到第一页
    handleSearch();
  };

  // 分页逻辑：跳转到某一页
  const handlePageChange = (page: number) => {
    const pagination = getPaginationData();
    pagination.currentPage = page;
    handleSearch();
  };

  // 详情查询逻辑
  const handleDetail = async (id: string) => {
    console.log("执行详情查询逻辑", id);
    // 在这里调用详情查询的 API
    // 示例：const detail = await api.detail(id);
    const detail = {};
    // 返回详情数据
    return detail;
  };


  const dialogFormData = reactive<IDialogFormData>({
    type: 1,//0详情，1新建 2编辑
    visible: false,
    title: '新建',
    formData: {}, // 表单数据
  })
  const openDetailDialogForm = () => {
    dialogFormData.visible = true;
    dialogFormData.type = 0;
    dialogFormData.title = '详情';
    dialogFormData.formData = {};
  }
  const openAddDialogForm = () => {
    dialogFormData.visible = true;
    dialogFormData.type = 1;
    dialogFormData.title = '新建';
    dialogFormData.formData = {};
  }
  const openEditDialogForm = () => {
    dialogFormData.visible = true;
    dialogFormData.type = 2;
    dialogFormData.title = '编辑';
    dialogFormData.formData = {};
  }
  const closeDialogForm = () => {
    dialogFormData.visible = false;
  }


  return {
    handleSearch,
    handleReset,
    handleCreate,
    handleEdit,
    handleDelete,
    handleBatchDelete,
    handleImport,
    handleExport,
    handleSizeChange,
    handlePageChange,
    handleDetail,
    dialogFormData,
    openDetailDialogForm,
    openAddDialogForm,
    openEditDialogForm,
    closeDialogForm,
  };
};

// 单例模式
export const useCrudOperations = () => {
  if (!instance) {
    instance = createCrudOperations();
  }
  return instance;
};
