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

## CI/CD 增量构建

在 Jenkins/GitLab CI 中实现增量构建：

```bash
# 检测 app-a 是否有变更
if git diff --name-only HEAD^ HEAD | grep -qE "packages/(app-a|common-utils)"; then
    echo "✅ 构建 app-a"
    pnpm install
    pnpm --filter app-a build
    # 部署命令...
else
    echo "⏭️  跳过 app-a"
    exit 0
fi

# 检测 app-b 是否有变更
if git diff --name-only HEAD^ HEAD | grep -qE "packages/(app-b|common-utils)"; then
    echo "✅ 构建 app-b"
    pnpm install
    pnpm --filter app-b build
    # 部署命令...
else
    echo "⏭️  跳过 app-b"
    exit 0
fi
```

**注意事项：**

- Jenkins 需要拉取至少 2 次提交的历史（不能用 `git clone --depth=1`）
- 如果 `HEAD^` 不存在，可以用 `git diff origin/main HEAD` 代替
- common-utils 变更时，app-a 和 app-b 都会被构建

## 更多文档

- [部署文档](./DEPLOYMENT.md) - 生产环境部署指南
