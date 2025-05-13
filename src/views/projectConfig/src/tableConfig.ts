interface IOptionsData {
  label: string;
  value: string | number | boolean | any;
  [key: string]: any;
}

interface PropMetadata {
  type: string; // 属性类型，如 'string', 'boolean', 'number'
  options?: IOptionsData[]; // 可选值（仅适用于类型为 'string' 且有选项的情况）
  label: string; // 属性中文标签
}

interface EventMetadata {
  description: string; // 事件描述
  label: string; // 事件中文标签
}

interface SlotMetadata {
  description: string; // 插槽描述
  label: string; // 插槽中文标签
}

interface ComponentMetadata {
  props: Record<string, PropMetadata>; // 组件属性元数据
  events: Record<string, EventMetadata>; // 组件事件元数据
  slots: Record<string, SlotMetadata>; // 组件插槽元数据
}

type ComponentMetadataMap = Record<string, ComponentMetadata>; // 组件元数据映射

interface ComponentConfig {
  props: Record<string, any>; // 组件属性配置
  events: Record<string, any>; // 组件事件配置
  slots: Record<string, any>; // 组件插槽配置
}

export {
  PropMetadata,
  EventMetadata,
  SlotMetadata,
  ComponentMetadata,
  ComponentMetadataMap,
  ComponentConfig
}
