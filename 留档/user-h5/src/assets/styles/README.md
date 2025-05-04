# 瞬影前端样式指南

## 样式管理架构

项目采用多层级样式管理策略，确保样式的可维护性与代码质量：

1. **基础样式层** (`base.css`)
   - CSS变量定义（颜色、间距、圆角等）
   - 基础元素重置
   - 全局公共样式

2. **组件样式层** (各组件的 `<style>` 标签)
   - 组件特定样式，使用 scoped 隔离
   - 尽量使用 CSS 变量确保统一性

3. **工具类层** (UnoCSS/Tailwind工具类)
   - 用于快速开发的原子类
   - 尽量用于布局和简单样式，复杂样式应移至组件样式

## 样式编写规范

### 1. CSS变量优先

始终使用CSS变量定义的颜色、间距等，而非硬编码值：

```css
/* 推荐 */
.element {
  color: var(--text-color);
  margin: var(--spacing-md);
}

/* 不推荐 */
.element {
  color: #333333;
  margin: 12px;
}
```

### 2. 组件样式作用域

组件样式应使用 `scoped` 属性避免污染全局：

```vue
<style scoped>
.component-name {
  /* 样式 */
}
</style>
```

### 3. 命名规范

- 使用 kebab-case 命名 class
- 避免过深的选择器嵌套（不超过3层）
- 避免使用 id 选择器
- 组件主类名应与组件名称保持一致

例如，`UserProfile.vue` 组件应使用 `.user-profile` 作为主类名。

### 4. UnoCSS/Tailwind使用规范

- 对于简单布局和常见样式，优先使用工具类
- 对于重复使用的样式组合，应创建组件级CSS类而非重复工具类组合
- 过长的工具类组合应提取为组件样式

```html
<!-- 推荐 -->
<div class="card">内容</div>

<!-- 不推荐（过长组合） -->
<div class="bg-white rounded-md shadow-sm p-4 mb-4">内容</div>
```

### 5. 媒体查询

针对移动端不同尺寸设备的适配，应统一使用以下断点：

```css
/* 小型手机 */
@media (max-width: 360px) {
  /* 样式 */
}

/* 中型手机 */
@media (min-width: 361px) and (max-width: 480px) {
  /* 样式 */
}

/* 大型手机/小型平板 */
@media (min-width: 481px) {
  /* 样式 */
}
```

## Vant组件定制

当需要定制Vant组件样式时：

1. 避免直接覆盖Vant的原始类名
2. 使用CSS变量覆盖Vant的主题变量
3. 对于特定组件的自定义样式，使用包装组件

```css
/* 覆盖Vant主题变量 */
:root {
  --van-primary-color: var(--primary-color);
  --van-success-color: var(--success-color);
  /* 其他覆盖... */
}
```

## 设计衔接与样式分离

为确保后续设计部门能轻松接入UI设计：

1. 避免在业务逻辑代码中硬编码样式值
2. 保持样式与逻辑分离
3. 使用CSS变量统一管理主题

**重要**：在MVP阶段应以功能实现为主，保持最小化样式，但需确保样式架构规范，为后续设计部门接入打好基础。 