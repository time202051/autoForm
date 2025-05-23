// DictionaryService.ts

// 定义字典项的类型
interface Dictionary {
  name: string; // 字典名称
  values: string[]; // 字典值列表
}

class DictionaryService {
  private dictionaries: Map<string, string[]> = new Map(); // 使用 Map 存储数据字典
  private isLoaded: boolean = false; // 标记字典是否已加载
  private static instance: DictionaryService; // 单例实例

  constructor() {
    if (DictionaryService.instance) {
      return DictionaryService.instance;
    }
    this.dictionaries = new Map();
    this.isLoaded = false;
    DictionaryService.instance = this;
  }

  // 初始化加载所有数据字典
  async init(apiUrl: string): Promise<void> {
    if (this.isLoaded) return; // 避免重复加载

    try {
      const response = await fetch(apiUrl);
      const data: Dictionary[] = await response.json();

      if (Array.isArray(data)) {
        data.forEach(dict => {
          this.dictionaries.set(dict.name, dict.values); // 假设字典有 name 和 values 字段
        });
        this.isLoaded = true;
        console.log('数据字典加载完成');
      } else {
        console.error('数据字典格式错误');
      }
    } catch (error) {
      console.error('加载数据字典失败:', error);
    }
  }

  // 通过名称获取对应的字典
  getDictionaryByName(name: string): string[] | null {
    if (!this.isLoaded) {
      console.warn('数据字典未加载，请先调用 init 方法');
      return null;
    }
    return this.dictionaries.get(name) || null; // 如果找不到返回 null
  }
}

// 创建单例实例并导出
export const dictionaryService = new DictionaryService();
