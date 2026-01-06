# Monorepo Demo - Next.js + TypeScript

这是一个使用 pnpm workspace 的 monorepo 示例项目，采用 Next.js 14 + TypeScript + Tailwind CSS。

## 项目结构

```
monorepo-demo/
├── packages/
│   ├── common-utils/         # 共享工具库 (TypeScript)
│   │   └── src/
│   │       └── index.ts
│   ├── app-a/                # Next.js 应用 A (端口 3000)
│   │   └── src/
│   │       └── app/
│   └── app-b/                # Next.js 应用 B (端口 3001)
│       └── src/
│           └── app/
├── package.json
└── pnpm-workspace.yaml
```

## 使用方法

1. 安装依赖：

```bash
pnpm install
```

2. 开发模式：

```bash
# 运行 app-a (http://localhost:3000)
pnpm dev:a

# 运行 app-b (http://localhost:3001)
pnpm dev:b

# 同时运行所有应用
pnpm dev:all
```

3. 构建生产版本：

```bash
pnpm build
```

4. 类型检查：

```bash
pnpm type-check
```

## 技术栈

- **Next.js 14** - React 框架，支持 App Router
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **pnpm workspace** - Monorepo 管理

## 特点

- 使用 `workspace:*` 协议引用本地包
- common-utils 提供 TypeScript 类型定义
- 两个 Next.js 应用共享同一个工具库
- 支持并行开发和构建
- 完整的 TypeScript 支持
