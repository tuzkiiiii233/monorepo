FROM node:18-alpine AS base

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/common-utils/package.json ./packages/common-utils/
COPY packages/app-a/package.json ./packages/app-a/
COPY packages/app-b/package.json ./packages/app-b/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 生产环境镜像
FROM node:18-alpine AS runner

RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

WORKDIR /app

ENV NODE_ENV production

# 复制构建产物
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages ./packages
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-workspace.yaml ./

EXPOSE 3000 3001

# 默认启动 app-a，可通过 docker-compose 覆盖
CMD ["pnpm", "dev:all"]
