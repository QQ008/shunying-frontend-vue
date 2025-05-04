import request from '@/utils/request'

// 定义示例接口的响应数据类型 (根据实际情况调整)
interface TestData {
  message: string;
  timestamp: number;
}

/**
 * 获取测试数据
 */
export function getTestData(): Promise<TestData> {
  return request<TestData>({
    url: '/test', // 示例接口路径
    method: 'get'
  });
}

/**
 * 提交测试数据
 * @param data
 */
export function postTestData(data: any): Promise<any> { // 响应类型可以更具体
  return request({
    url: '/test',
    method: 'post',
    data
  });
} 