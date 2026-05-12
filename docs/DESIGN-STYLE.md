# DESIGN STYLE

> 本文档描述 wankong.top 的设计语言体系，涵盖色彩、字体、间距、动效、组件模式和设计理念。作为后续设计与开发的参考基线。

---

## 1. 设计理念

**极简 / 粗野主义倾向 / 重边框 / 单色系**

- 大量使用 `border` 勾勒元素边界，替代阴影分隔
- 所有组件 `rounded-none`（无圆角），强调硬朗几何感
- 单色中性调（neutral）作为主色，辅以微妙的 hover 状态变化
- 噪点纹理叠加赋予页面材质感，避免纯色背景过于"干净"
- 中文优先的标签体系，英文用于元数据与技术标识

---

## 2. 色彩系统

基于 **OKLCH** 色彩空间，通过 CSS 自定义属性实现亮/暗双主题。

### 语义色板

| Token                | Light              | Dark                 | 用途                     |
| -------------------- | ------------------ | -------------------- | ------------------------ |
| `--background`       | `oklch(1 0 0)`     | `oklch(0.145 0 0)`   | 页面底色                 |
| `--foreground`       | `oklch(0.145 0 0)` | `oklch(0.985 0 0)`   | 正文色                   |
| `--card`             | `oklch(1 0 0)`     | `oklch(0.205 0 0)`   | 卡片底色                 |
| `--primary`          | `oklch(0.205 0 0)` | `oklch(0.922 0 0)`   | 主色（按钮、强调文字）   |
| `--secondary`        | `oklch(0.97 0 0)`  | `oklch(0.269 0 0)`   | 次要背景                 |
| `--muted`            | `oklch(0.97 0 0)`  | `oklch(0.269 0 0)`   | 弱化背景                 |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.708 0 0)`   | 弱化文字（元数据、标签） |
| `--border`           | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | 边框色                   |
| `--ring`             | `oklch(0.708 0 0)` | `oklch(0.556 0 0)`   | 聚焦环                   |

### 点缀色

| Token                     | Light                       | Dark                        | 用途      |
| ------------------------- | --------------------------- | --------------------------- | --------- |
| `--destructive`           | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | 错误/删除 |
| `--chart-1` ~ `--chart-5` | 各色相                      | 暗调适配                    | 图表      |

### 产品状态色

- **已上线**: `emerald-500` 系 — 边框 `emerald-500/45`，背景 `emerald-500/10`
- **Beta**: `amber-500` 系 — 边框 `amber-500/45`，背景 `amber-500/10`

### 设计原则

- 全站无色相偏移（neutral 色板），色彩仅用于状态标签和产品图标
- 暗色模式下 `--border` 和 `--input` 使用 `oklch(1 0 0 / 10%~15%)` 半透明白色
- 所有颜色变量在 `globals.css` 中通过 `@theme inline` 注册为 Tailwind 色标

---

## 3. 字体系统

4 款 Google Fonts，按功能域分组：

| 变量名           | 字体                 | 用途                         | CSS 类         |
| ---------------- | -------------------- | ---------------------------- | -------------- |
| `--font-mono`    | JetBrains Mono       | **默认正文字体**、代码       | `font-mono`    |
| `--font-ui`      | Space Grotesk        | 标题、UI 标签、导航          | `font-ui`      |
| `--font-display` | Doto                 | 装饰性展示（当前未大量使用） | `font-display` |
| `--font-data`    | Space Mono (400/700) | 日期、编号、元数据、技术标签 | `font-data`    |

### 字体层级

| 层级        | 字号                      | 字重            | 字体               | 场景                   |
| ----------- | ------------------------- | --------------- | ------------------ | ---------------------- |
| H1 大标题   | `text-3xl` ~ `text-5xl`   | `font-semibold` | `font-ui`          | 博客文章标题           |
| H2 区域标题 | `text-2xl`                | `font-semibold` | `font-ui`          | 首页各区块标题         |
| H3 卡片标题 | `text-lg` ~ `text-xl`     | `font-medium`   | `font-ui`          | 博客卡片、产品卡片     |
| 正文        | `text-sm` ~ `text-base`   | normal          | `font-mono` (默认) | 描述文字、段落         |
| 元数据      | `text-[10px]` ~ `text-xs` | normal          | `font-data`        | 日期、编号、标签       |
| 小标签      | `text-[11px]` ~ `text-xs` | normal          | `font-data`        | 状态标签、技术栈 badge |

### 排版细节

- 正文行高: `leading-6` ~ `leading-7`（宽松可读）
- 元数据字母间距: `tracking-[0.08em]` ~ `tracking-[0.2em]`（大写风格）
- 区域标签: `uppercase tracking-[0.2em]`（如 "关于我"、"博客"）
- 全局 `antialiased` 字体平滑

---

## 4. 间距与布局

### 容器

- 最大宽度: `max-w-5xl` (1024px)
- 水平内边距: `px-4 sm:px-6`
- 垂直内边距: 区块级 `py-10`，页级 `pb-20`

### 网格

- 两栏布局（首页区块）: `grid sm:grid-cols-[0.82fr_1.18fr]` 或 `[0.9fr_1.1fr]`
- 三栏布局（产品卡片）: `grid sm:grid-cols-3`
- 博客时间线: `grid sm:grid-cols-[8rem_1fr]`
- 卡片内网格: `gap-3` ~ `gap-5`

### 区块间距

- 区块间分隔: `gap-10`（首页各 section 之间）
- 卡列表间距: `gap-3`
- 区块内标签与内容: `gap-2` ~ `gap-5`

### 分隔线

- 区块分隔: `border-t border-border` + `pt-10`
- 纵向分隔: `border-l border-border` + `pl-4` ~ `pl-5`
- About 区块使用 `border-y` 上下双线分隔

---

## 5. 边框与形状

### 形状

- **全局无圆角**: `rounded-none` 是所有组件的默认值
- 例外: 头像 `rounded-full`，Logo SVG 自然形状
- 产品图标容器: 方形（`size-9` 等）

### 边框

- 默认: `border border-border`
- 交互卡片 hover: `hover:border-foreground/35`
- 导航链接无边框（link variant）
- Prose 代码块边框: `border border-border`

---

## 6. 动效系统

### 入场动画

| 动画名                 | 效果                  | 缓动                             | 时长  | 场景                |
| ---------------------- | --------------------- | -------------------------------- | ----- | ------------------- |
| `blog-enter`           | 从下方淡入 + 模糊消散 | `cubic-bezier(0.2, 0.8, 0.2, 1)` | 0.7s  | 博客标题、页面 hero |
| `blog-card-enter`      | 从下方微移淡入        | `cubic-bezier(0.2, 0.8, 0.2, 1)` | 0.42s | 博客卡片列表        |
| `product-title-reveal` | 模糊消散显现          | `cubic-bezier(0.2, 0.8, 0.2, 1)` | 0.72s | 产品页标题          |
| `logo-draw`            | SVG 描边动画          | linear                           | 1s    | Logo 绘制           |
| `logo-fill`            | SVG 填充显现          | linear                           | 1s    | Logo 填充           |

### 交错延迟

- 多个卡片依次入场，延迟递增 `60ms` ~ `80ms`
- 博客归档: 年份区块 + `80ms/区`，卡片 + `45ms/张`
- 产品归档: `120ms + index × 60ms`

### 交互动效

- **链接箭头**: hover 时 `-translate-y-0.5` + `translate-x-0.5`，透明度 `45→100`
- **卡片 hover**: `border-foreground/35` 边框高亮，`bg-muted/50` 背景变暗
- **按钮 active**: `translate-y-px`（按下感）
- **BackTop 按钮**: 出现/消失 `scale + opacity`，点击时弹性动画

### 主题切换

- 使用 View Transition API 实现形状变体切换（circle/rectangle/etc）
- 缓动: `ease-in-out`，star 变体使用 `linear`
- 伪元素动画禁用默认过渡，自定义 clipPath 揭示

### 文本动画

- **EncryptedText**: 字符级解密效果（gibberish → 原文），进入视口时触发
- **WordRotate**: 单词循环切换，上下滑动
- **SplittingText**: 字符级交错淡入 + 模糊消散

### Reduced Motion

- `motion-reduce:animate-none` 全局禁用动画
- `prefers-reduced-motion: reduce` 媒体查询停止入场动画

---

## 7. 组件模式

### 按钮 (Button)

- 基于 `@base-ui/react/button` + `cva` 变体系统
- 变体: `default` / `outline` / `secondary` / `ghost` / `destructive` / `link`
- 尺寸: `xs` / `sm` / `default` / `lg` / `icon` / `icon-xs` / `icon-sm` / `icon-lg`
- 默认: `h-8`, `rounded-none`, `border border-transparent`
- focus-visible: `ring-1 ring-ring/50`

### 卡片

- 基于 `border border-border` + `bg-card`
- 博客卡片: 网格布局 `sm:grid-cols-[6rem_1fr_auto]`，含日期 + 标题 + 箭头
- 产品卡片: 纵向堆叠，含图标 + 标题 + 状态 + 描述 + 箭头
- Hover 统一: `border-foreground/35` + `bg-muted/50`

### 标签 / Badge

- **SkillBadge**: `inline-flex` + `border border-border` + `font-data` + 图标 + 文字
  - 默认尺寸: `h-9`, `text-xs`, 图标 `size-4`
  - 小尺寸: `h-7`, `text-[11px]`, 图标 `size-3.5`
- **ProductStatus**: 带色边框 + 10% 透明背景 + `font-data text-[11px] uppercase`
  - 带圆点指示器 (`showDot`)

### 导航

- 顶部导航: `flex max-w-5xl`, 链接使用 `buttonVariants({ variant: "link" })`
- 分隔符: `<span className="h-px flex-1 bg-border" />`
- 页脚: 备案号 + GitHub 图标

### 链接与箭头

- 统一使用 Remix Icon 的 `RiArrowRightUpLine` 作为外部/跳转指示
- 尺寸: `size-4`（默认）, `size-3`（小号）
- Hover 动画: 向右上微移
- 返回链接使用 `RiArrowLeftLine`

---

## 8. 图标体系

| 库                               | 用途                                      |
| -------------------------------- | ----------------------------------------- |
| `@remixicon/react`               | UI 图标（箭头、太阳/月亮、搜索、外链等）  |
| `@icons-pack/react-simple-icons` | 品牌图标（GitHub、Vue、React、Docker 等） |

---

## 9. 纹理与质感

### NoiseTexture

- SVG `feTurbulence` 滤镜生成噪点
- 参数: `baseFrequency=0.4`, `numOctaves=6`, `slope=0.15`, `opacity=0.6`
- 暗色模式: `opacity-[0.75]`
- 固定定位覆盖全页，`pointer-events-none`

---

## 10. 技术栈映射

| 层     | 技术                                                       |
| ------ | ---------------------------------------------------------- |
| 框架   | Next.js 16 (App Router, RSC, SSG)                          |
| 样式   | Tailwind CSS v4 + `@tailwindcss/typography`                |
| 组件库 | shadcn/ui (base-lyra, neutral, cssVariables)               |
| 动效   | motion (原 framer-motion) + tw-animate-css + CSS keyframes |
| 主题   | next-themes (class 策略, light 默认)                       |
| 图标   | Remix Icon + Simple Icons + Phosphor Icons                 |
| 内容   | MDX (Shiki 代码高亮, GFM, 自定义 heading IDs)              |
| 质量   | Biome (lint + format)                                      |
