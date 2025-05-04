import request from '@/utils/request'

// 模拟颜色选项接口
export interface ColorOption {
  name: string; // 显示名称，如 "红色"
  value: string; // 实际值，可能与 name 相同或为色号等
}

// 统一的模拟颜色数据
const mockColorData: ColorOption[] = [
  { name: '红色', value: '红' }, { name: '蓝色', value: '蓝' },
  { name: '绿色', value: '绿' }, { name: '黄色', value: '黄' },
  { name: '黑色', value: '黑' }, { name: '白色', value: '白' },
  { name: '灰色', value: '灰' }, { name: '橙色', value: '橙' },
  { name: '紫色', value: '紫' }, { name: '粉色', value: '粉' },
];

/**
 * 获取可筛选的【骑行服】颜色选项 (模拟 API)
 */
export function getJerseyColorOptions(): Promise<ColorOption[]> {
  console.log('Calling mock API: getJerseyColorOptions');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockColorData]); // 返回副本
    }, 150 + Math.random() * 200);
  });
}

/**
 * 获取可筛选的【骑行裤】颜色选项 (模拟 API)
 */
export function getPantsColorOptions(): Promise<ColorOption[]> {
  console.log('Calling mock API: getPantsColorOptions');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockColorData]); // 返回副本
    }, 180 + Math.random() * 250);
  });
}

/**
 * 获取可筛选的【鞋子】颜色选项 (模拟 API)
 */
export function getShoeColorOptions(): Promise<ColorOption[]> {
  console.log('Calling mock API: getShoeColorOptions');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockColorData]); // 返回副本
    }, 200 + Math.random() * 300);
  });
}

/**
 * 获取可筛选的颜色选项 (模拟 API)
 */
export function getColorOptions(): Promise<ColorOption[]> {
  console.log('Calling mock API: getColorOptions');
  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockColors: ColorOption[] = [
        { name: '红色', value: '红' },
        { name: '蓝色', value: '蓝' },
        { name: '绿色', value: '绿' },
        { name: '黄色', value: '黄' },
        { name: '黑色', value: '黑' },
        { name: '白色', value: '白' },
        { name: '灰色', value: '灰' },
        { name: '橙色', value: '橙' },
        { name: '紫色', value: '紫' },
        { name: '粉色', value: '粉' },
      ];
      resolve(mockColors);
    }, 200 + Math.random() * 300); // 模拟 0.2 - 0.5 秒的延迟
  });

  /*
  // 实际调用示例:
  return request<ColorOption[]>({
    url: '/common/colors', // 假设的后端 API 路由
    method: 'get'
  });
  */
}

// 地点选项接口 (简单模拟，可以扩展为级联结构)
export interface LocationOption {
  text: string; // 显示名称
  value: string; // 实际值
  // children?: LocationOption[]; // 用于级联
}

/**
 * 获取可筛选的地点选项 (模拟 API)
 * @param parentValue 父级值 (用于级联加载，可选)
 */
export function getLocationOptions(parentValue?: string): Promise<LocationOption[]> {
  console.log('Calling mock API: getLocationOptions', parentValue);
  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      // 简单模拟几个北京的热门骑行地点
      const mockLocations: LocationOption[] = [
        { text: '全部地点', value: '' }, // 添加一个"全部"选项
        { text: '妙峰山', value: '妙峰山' },
        { text: '四海', value: '四海' },
        { text: '奥森公园', value: '奥森公园' },
        { text: '环路 (二环/三环...)', value: '环路' },
        { text: '长安街', value: '长安街' },
        { text: '其他郊区', value: '其他郊区' },
      ];
      // 如果需要模拟级联，可以根据 parentValue 返回不同的子列表
      resolve(mockLocations);
    }, 250 + Math.random() * 350);
  });

  /*
  // 实际调用示例:
  return request<LocationOption[]>({
    url: '/common/locations',
    method: 'get',
    params: { parent: parentValue } // 传递父级参数
  });
  */
}

/**
 * 获取车型选项 (模拟)
 */
// export function getBikeTypeOptions(): Promise<string[]> { ... } 