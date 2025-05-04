import request from '@/utils/request'

// 筛选参数接口
export interface SearchImageParams {
  page?: number;       // 页码
  limit?: number;      // 每页数量
  dateStart?: string;  // 开始日期 YYYY-MM-DD
  dateEnd?: string;    // 结束日期 YYYY-MM-DD
  dateRangeText?: string; // 新增：用于 UI 显示的日期范围文本
  location?: string;   // 地点关键字
  // time?: string;    // 时间关键字 (移到 timeRange)
  targetTime?: number;        // 新增：目标时间点 (0-24)
  bikeType?: string[]; // 车型 (数组)
  jerseyColor?: string; // 骑行服颜色 (单选, '' 表示全部)
  pantsColor?: string;  // 骑行裤颜色 (单选)
  shoeColor?: string;   // 鞋子颜色 (单选)
  // colors?: string;     // 最终传给后端的颜色字符串 (逗号分隔), 现在可能不需要了，后端直接处理单字段
  // ... 其他可能的筛选参数，如 eventId, photographerId 等
}

// 图片组信息接口 (基于数据库表简化)
export interface ImageGroup {
  id: number;
  coverImageUrl: string | null; // 封面图路径 (可能来自 IMAGE_GROUPS 或 IMAGES)
  imageCount?: number;          // 组内图片数量 (需要后端聚合)
  shootDate?: string | null;    // 拍摄日期 (可能来自 IMAGE_GROUPS)
  locationName?: string | null; // 地点名称 (关联 LOCATION)
  photographerName?: string | null; // 摄影师昵称 (关联 WORKERS)
  eventName?: string | null;    // 赛事/活动名称 (关联 EVENTS)
  // ... 其他需要展示的信息
}

// 单张图片信息接口 (基于 IMAGES 表简化)
export interface ImageInfo {
  id: number;
  originalPath?: string; // 原图路径 (需要权限才返回?)
  previewPath: string;  // 预览图路径 (带水印?)
  coverPath?: string;   // 封面图路径
  shootTime?: string;   // 拍摄时间
  // 新增摄影元数据
  originalResolution?: string; // 如 "1920x1080"
  previewResolution?: string; // 如 "800x600"
  cameraModel?: string;       // 相机型号
  lensModel?: string;         // 镜头型号
  shutterSpeed?: string;      // 快门速度 (如 "1/1000s")
  aperture?: string;          // 光圈值 (如 "f/2.8")
  iso?: string;               // 感光度 (如 "ISO 100")
  ev?: string;                // EV值 (如 "+0.3")
  whiteBalance?: string;      // 白平衡 (如 "自动")
  // 可以添加更多字段如 分辨率, EXIF 等
}

// 图片组详情数据接口
export interface ImageGroupDetailData extends Omit<ImageGroup, 'coverImageUrl' | 'photographerName'> { // 继承列表信息，去掉列表用的封面和摄影师名称（下面单独定义）
  // 包含上面 ImageGroup 的大部分字段，如 id, shootDate, locationName 等
  description?: string; // 图片组描述 (假设有)
  images: ImageInfo[];   // 组内图片列表
  eventName?: string | null;
  shootDate?: string | null;
  locationName?: string | null;
  imageCount?: number | undefined;
  // 新增摄影师信息
  photographerId?: number; // 摄影师ID
  photographerName?: string; // 摄影师昵称
  photographerAvatar?: string; // 摄影师头像 URL (可选)
}

/**
 * 根据条件搜索图片组 (模拟 API)
 * @param params
 */
export function searchImages(params: SearchImageParams): Promise<ImageGroup[]> {
  console.log('Calling mock API: searchImages with single color', params);

  return new Promise((resolve) => {
    setTimeout(() => {
      const page = params.page || 1;
      const limit = params.limit || 10;
      const mockData: ImageGroup[] = [];
      if (page > 3) {
        resolve([]);
        return;
      }
      for (let i = 0; i < limit; i++) {
        const groupId = (page - 1) * limit + i + 1;
        // 模拟过滤 (非常粗略)
        if (params.targetTime !== undefined && (groupId % 24 !== params.targetTime % 24)) { continue; }
        if (params.location && params.location !== '全部地点' && params.location !== ('模拟地点' + String.fromCharCode(65 + i))) { /* continue; */}
        const bikeTypes = params.bikeType || [];
        const eventNameSeed = bikeTypes.length > 0 ? bikeTypes[groupId % bikeTypes.length] : `综合活动 ${groupId % 3}`;
        // 模拟单颜色过滤 (假设后端能处理 jerseyColor, pantsColor, shoeColor)
        // 注意：这里只是模拟，实际后端需要根据传入的非空颜色值进行过滤
        if (params.jerseyColor && params.jerseyColor !== ['红', '蓝', '黑'][groupId % 3] ) { /* continue; */}
        if (params.pantsColor && params.pantsColor !== ['白', '灰', '黑'][groupId % 3] ) { /* continue; */}
        if (params.shoeColor && params.shoeColor !== ['黄', '绿', '橙'][groupId % 3] ) { /* continue; */} // 添加鞋子颜色模拟过滤

        mockData.push({
          id: groupId, coverImageUrl: `https://picsum.photos/seed/${groupId}/300/400`,
          imageCount: Math.floor(Math.random() * 10) + 1, shootDate: params.dateStart || '2025-04-20',
          locationName: params.location || '模拟地点' + String.fromCharCode(65 + i),
          photographerName: `摄影师 ${groupId % 5}`, eventName: `模拟${eventNameSeed}`,
        });
      }
      resolve(mockData);
    }, 500 + Math.random() * 500);
  });

  /*
  // 实际调用示例:
  return request<ImageGroup[]>({
    url: '/images/search', // 假设的后端 API 路由
    method: 'get',
    params: params // GET 请求使用 params 传递参数
    // 如果是 POST 请求，则用 data: params
  });
  */
}

/**
 * 获取图片组详情 (模拟 API)
 * @param id 图片组 ID
 */
export function getImageGroupDetail(id: number): Promise<ImageGroupDetailData> {
  console.log('Calling mock API: getImageGroupDetail', id);

  // 模拟网络延迟
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟找不到的情况
      if (id > 30) { // 假设 ID 大于 30 的不存在
         reject(new Error('Image group not found'));
         return;
      }

      // 模拟详情数据
      const imageCount = Math.floor(Math.random() * 15) + 5;
      const detailData: ImageGroupDetailData = {
        id: id,
        imageCount: imageCount, // 详情页图片数量多一点
        shootDate: '2025-04-20',
        locationName: '模拟详情地点' + String.fromCharCode(65 + (id % 5)),
        photographerId: id % 5 + 1, // 模拟摄影师 ID
        photographerName: `摄影师 ${id % 5}`,
        photographerAvatar: `https://i.pravatar.cc/150?u=photographer${id % 5}`, // 模拟头像
        eventName: `模拟活动详情 ${id % 3}`,
        description: `这是图片组 #${id} 的详细描述信息。这里可以放一些关于这次拍摄的说明文字。照片总数：${imageCount}张。`,
        images: Array.from({ length: imageCount }, (_, i) => {
          const imageId = id * 100 + i + 1;
          const apertureValues = ['f/1.8', 'f/2.8', 'f/4', 'f/5.6', 'f/8'];
          const shutterSpeeds = ['1/500s', '1/1000s', '1/2000s', '1/4000s'];
          const isos = ['ISO 100', 'ISO 200', 'ISO 400', 'ISO 800'];
          const whiteBalances = ['自动', '日光', '阴天', '白炽灯'];
          const evs = ['-0.3', '0', '+0.3', '+0.7'];
          return {
            id: imageId,
            previewPath: `https://picsum.photos/seed/${imageId}/400/600`,
            shootTime: new Date(Date.now() - i * 60000).toISOString(),
            originalResolution: '6000x4000',
            previewResolution: '1200x800',
            cameraModel: `相机型号 ${String.fromCharCode(65 + (imageId % 5))}`,
            lensModel: `镜头 ${18 + (imageId % 4) * 10}-${55 + (imageId % 3) * 20}mm`,
            aperture: apertureValues[imageId % apertureValues.length],
            shutterSpeed: shutterSpeeds[imageId % shutterSpeeds.length],
            iso: isos[imageId % isos.length],
            whiteBalance: whiteBalances[imageId % whiteBalances.length],
            ev: evs[imageId % evs.length],
          };
        }),
      };

      resolve(detailData);
    }, 300 + Math.random() * 400); // 模拟 0.3 - 0.7 秒的延迟
  });

  /*
  // 实际调用示例:
  return request<ImageGroupDetailData>({
    url: `/image-groups/${id}`, // 假设的后端 API 路由
    method: 'get'
  });
  */
} 